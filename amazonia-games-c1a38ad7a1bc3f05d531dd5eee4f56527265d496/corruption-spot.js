/**
 * corruption-spot — Foco de Vazio purificável pelo totem.
 * Encolhe conforme HP diminui e brilha quando atingido.
 */
AFRAME.registerComponent('corruption-spot', {
  schema: {
    radius: { type: 'number', default: 0.6 }
  },

  init: function () {
    var el = this.el;
    el.classList.add('damageable', 'corruption');

    var blob = document.createElement('a-circle');
    blob.setAttribute('radius', this.data.radius);
    blob.setAttribute('rotation', '-90 0 0');
    blob.setAttribute('color', '#330066');
    blob.setAttribute('material', 'opacity: 0.9; transparent: true; shader: flat; side: double; emissive: #330066');
    blob.setAttribute('animation__pulse',
      'property: scale; from: 1 1 1; to: 1.15 1.15 1.15; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine');
    el.appendChild(blob);
    this.blob = blob;

    // Tentáculo violeta visível
    var tendril = document.createElement('a-cone');
    tendril.setAttribute('radius-bottom', this.data.radius * 0.5);
    tendril.setAttribute('radius-top', 0.05);
    tendril.setAttribute('height', 1.8);
    tendril.setAttribute('position', '0 0.9 0');
    tendril.setAttribute('color', '#4B0082');
    tendril.setAttribute('material', 'opacity: 0.8; transparent: true; shader: flat; emissive: #4B0082; emissiveIntensity: 0.3');
    tendril.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear');
    el.appendChild(tendril);
    this.tendril = tendril;

    this.hp = 100;
    this.maxHp = 100;
  },

  takeDamage: function (amount) {
    this.hp = Math.max(0, this.hp - amount);
    // Visual feedback — encolhe conforme HP cai
    var pct = this.hp / this.maxHp;
    this.el.object3D.scale.set(pct, pct, pct);
    // Brilha branco quando atingido
    if (this.blob) {
      this.blob.setAttribute('material', 'color: #FFFFFF; opacity: 0.9; emissive: #FFFFFF; emissiveIntensity: 0.5; transparent: true; shader: flat; side: double');
      var self = this;
      clearTimeout(this._flashTimer);
      this._flashTimer = setTimeout(function () {
        if (self.blob && self.blob.parentNode) {
          self.blob.setAttribute('material', 'color: #330066; opacity: 0.9; emissive: #330066; transparent: true; shader: flat; side: double');
        }
      }, 80);
    }
    if (this.hp <= 0) this._purify();
  },

  _purify: function () {
    var pos = this.el.object3D.position;
    var parent = this.el.parentNode;
    for (var i = 0; i < 20; i++) {
      var p = document.createElement('a-sphere');
      p.setAttribute('radius', 0.08);
      p.setAttribute('color', '#FFFFE0');
      p.setAttribute('material', 'emissive: #FFFFE0; emissiveIntensity: 1; shader: flat; opacity: 1; transparent: true');
      p.setAttribute('position', pos.x + ' ' + (pos.y + 0.5) + ' ' + pos.z);
      p.setAttribute('animation__m', 'property: position; to: ' +
        (pos.x + (Math.random() - 0.5) * 3) + ' ' +
        (pos.y + 2 + Math.random() * 2) + ' ' +
        (pos.z + (Math.random() - 0.5) * 3) + '; dur: 1500');
      p.setAttribute('animation__f', 'property: material.opacity; to: 0; dur: 1500');
      parent.appendChild(p);
      (function (pp) { setTimeout(function () { pp.parentNode && pp.parentNode.removeChild(pp); }, 1600); })(p);
    }
    if (this.el.sceneEl) this.el.sceneEl.emit('corruption-purified', { position: pos });
    if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
  }
});
