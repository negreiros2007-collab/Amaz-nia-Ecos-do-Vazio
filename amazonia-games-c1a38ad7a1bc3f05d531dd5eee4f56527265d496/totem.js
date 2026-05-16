/* ============================================================================
   TOTEM.JS — Purificação automática por olhar + feixe pra frente
   ============================================================================ */
AFRAME.registerComponent('totem', {
  schema: {
    energy:     { type: 'number', default: 100 },
    maxEnergy:  { type: 'number', default: 100 },
    powerLevel: { type: 'number', default: 0 }
  },

  init: function () {
    var el = this.el;
    this._raycaster = new THREE.Raycaster();
    this._tmpVec = new THREE.Vector3();
    this._tmpDir = new THREE.Vector3();
    this._currentHit = null;

    var body = document.createElement('a-cylinder');
    body.setAttribute('radius', 0.06); body.setAttribute('height', 0.4);
    body.setAttribute('segments-radial', 6); body.setAttribute('color', '#6B3410');
    el.appendChild(body);

    var ring = document.createElement('a-torus');
    ring.setAttribute('radius', 0.08); ring.setAttribute('radius-tubular', 0.012);
    ring.setAttribute('segments-radial', 6); ring.setAttribute('segments-tubular', 12);
    ring.setAttribute('position', '0 0.16 0'); ring.setAttribute('color', '#D4AF37');
    ring.setAttribute('material', 'emissive: #FFD700; emissiveIntensity: 0.8');
    el.appendChild(ring);

    var crystal = document.createElement('a-octahedron');
    crystal.setAttribute('radius', 0.07); crystal.setAttribute('position', '0 0.28 0');
    crystal.setAttribute('color', '#7FFFD4');
    crystal.setAttribute('material', 'emissive: #7FFFD4; emissiveIntensity: 1.2; opacity: 0.9; transparent: true');
    crystal.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear');
    el.appendChild(crystal);
    this.crystal = crystal;

    var halo = document.createElement('a-light');
    halo.setAttribute('type', 'point'); halo.setAttribute('color', '#7FFFD4');
    halo.setAttribute('intensity', 1); halo.setAttribute('distance', 5);
    halo.setAttribute('position', '0 0.28 0');
    el.appendChild(halo);
    this.halo = halo;

    // FEIXE: cilindro horizontal apontando pra frente do crystal
    // (relativo ao totem: vai do crystal pra frente do jogador)
    var beam = document.createElement('a-cylinder');
    beam.setAttribute('radius', 0.02);
    beam.setAttribute('height', 15);  // 15m de alcance
    beam.setAttribute('position', '0 0.28 -7.5'); // 7.5m à frente do crystal
    beam.setAttribute('rotation', '90 0 0'); // deita o cilindro horizontalmente
    beam.setAttribute('color', '#7FFFD4');
    beam.setAttribute('material', 'emissive: #7FFFD4; emissiveIntensity: 1; opacity: 0.7; transparent: true; shader: flat');
    beam.setAttribute('visible', false);
    el.appendChild(beam);
    this.beam = beam;

    this.beamActive = false;
    this.manualFire = false;
    this.energy = this.data.energy;
    this._bindInputs();
  },

  _bindInputs: function () {
    var self = this;
    var fire = function (on) { self.manualFire = on; };
    window.addEventListener('mousedown', function () { fire(true); });
    window.addEventListener('mouseup',   function () { fire(false); });
    window.addEventListener('touchstart', function (e) { e.preventDefault(); fire(true); }, { passive: false });
    window.addEventListener('touchend',   function () { fire(false); });
    window.addEventListener('keydown', function (e) { if (e.code === 'Space') fire(true); });
    window.addEventListener('keyup',   function (e) { if (e.code === 'Space') fire(false); });
  },

  tick: function (time, dt) {
    this._updateGazeTarget();

    var shouldFire = this.energy > 0 && (this.manualFire || this._currentHit !== null);
    if (shouldFire !== this.beamActive) {
      this.beamActive = shouldFire;
      this.beam.setAttribute('visible', shouldFire);
      this.halo.setAttribute('intensity', shouldFire ? 2 : 1);
    }

    if (this.beamActive) {
      this.energy = Math.max(0, this.energy - (dt / 1000) * 8);
      if (this.energy <= 0) {
        this.beamActive = false;
        this.beam.setAttribute('visible', false);
      }
      this._damage(dt);
    } else {
      this.energy = Math.min(this.data.maxEnergy, this.energy + (dt / 1000) * 5);
    }
    this.el.emit('totem-energy', { value: this.energy, max: this.data.maxEnergy });
  },

  _updateGazeTarget: function () {
    var camera = this.el.sceneEl.camera;
    if (!camera) return;
    camera.getWorldPosition(this._tmpVec);
    camera.getWorldDirection(this._tmpDir);
    this._raycaster.set(this._tmpVec, this._tmpDir);
    this._raycaster.far = 25;

    var targets = Array.prototype.slice.call(document.querySelectorAll('.damageable'));
    var objs = [];
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].object3D) objs.push(targets[i].object3D);
    }
    var hits = this._raycaster.intersectObjects(objs, true);
    var hitEl = null;
    for (var j = 0; j < hits.length && !hitEl; j++) {
      var o = hits[j].object;
      while (o) {
        if (o.el && o.el.classList && o.el.classList.contains('damageable')) {
          hitEl = o.el;
          break;
        }
        o = o.parent;
      }
    }
    this._currentHit = hitEl;
  },

  _damage: function (dt) {
    if (!this._currentHit) return;
    var dmg = (dt / 1000) * 45 * (1 + this.data.powerLevel * 0.2); // 45 DPS (era 30)
    var comp = this._currentHit.components['enemy-base'] || this._currentHit.components['corruption-spot'];
    if (comp && typeof comp.takeDamage === 'function') {
      comp.takeDamage(dmg);
    }
  },

  evolve: function (legendName) {
    this.data.powerLevel++;
    var colors = { curupira:'#90EE90', iara:'#1E90FF', boitata:'#FF4500', mapinguari:'#8B4513', boto:'#FFB6C1' };
    var c = colors[legendName] || '#FFFFFF';
    this.crystal.setAttribute('color', c);
    this.crystal.setAttribute('material', 'emissive: ' + c + '; emissiveIntensity: 1; opacity: 0.9; transparent: true');
    this.beam.setAttribute('color', c);
  }
});
