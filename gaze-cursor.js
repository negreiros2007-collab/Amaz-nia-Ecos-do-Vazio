/**
 * gaze-cursor — Cursor de mira ativável por olhar (gaze) por X segundos
 * Uso: <a-entity cursor="fuse: true; fuseTimeout: 2000" gaze-cursor></a-entity>
 *
 * Eventos disparados no objeto-alvo:
 *   gaze-enter    — quando o cursor entra no objeto
 *   gaze-leave    — quando o cursor sai
 *   gaze-progress — durante a fixação (detail.progress 0..1)
 *   gaze-fire     — quando completa o tempo (equivale a clique)
 */
AFRAME.registerComponent('gaze-cursor', {
  schema: {
    fuseTimeout: { type: 'number', default: 2000 }, // ms para ativar
    color:       { type: 'color',  default: '#FFFFFF' },
    activeColor: { type: 'color',  default: '#FFD700' }
  },

  init() {
    const el = this.el;
    this.fuseStart = null;
    this.target = null;

    // Anel visual do cursor (mira)
    el.setAttribute('geometry', 'primitive: ring; radiusInner: 0.012; radiusOuter: 0.02');
    el.setAttribute('material', `color: ${this.data.color}; shader: flat; opacity: 0.9; transparent: true`);
    el.setAttribute('position', '0 0 -0.6');
    el.setAttribute('raycaster', 'objects: .gaze-target; far: 50');

    // Anel de progresso interno
    const ring = document.createElement('a-entity');
    ring.setAttribute('id', 'gaze-progress');
    ring.setAttribute('geometry', 'primitive: ring; radiusInner: 0.014; radiusOuter: 0.018; thetaLength: 0');
    ring.setAttribute('material', `color: ${this.data.activeColor}; shader: flat; side: double`);
    ring.setAttribute('rotation', '0 0 90');
    el.appendChild(ring);
    this.progressRing = ring;

    el.addEventListener('raycaster-intersection', (e) => this._onEnter(e));
    el.addEventListener('raycaster-intersection-cleared', () => this._onLeave());
  },

  _onEnter(e) {
    const hit = e.detail.els[0];
    if (!hit || !hit.classList.contains('gaze-target')) return;
    this.target = hit;
    this.fuseStart = performance.now();
    hit.emit('gaze-enter');
  },

  _onLeave() {
    if (this.target) {
      this.target.emit('gaze-leave');
      this.target = null;
    }
    this.fuseStart = null;
    this.progressRing.setAttribute('geometry', 'thetaLength', 0);
  },

  tick() {
    if (!this.target || !this.fuseStart) return;
    const elapsed = performance.now() - this.fuseStart;
    const progress = Math.min(elapsed / this.data.fuseTimeout, 1);
    this.progressRing.setAttribute('geometry', 'thetaLength', progress * 360);
    this.target.emit('gaze-progress', { progress });

    if (progress >= 1) {
      this.target.emit('gaze-fire');
      this.target.emit('click'); // compatibilidade com handlers padrão
      this.fuseStart = performance.now() + 99999; // bloqueia re-disparo até sair
    }
  }
});

/**
 * gaze-target — marca um objeto como alvo de gaze (basta usar a classe CSS "gaze-target",
 * mas este componente adiciona reação visual ao ser focado).
 */
AFRAME.registerComponent('gaze-target', {
  schema: {
    hoverScale: { type: 'number', default: 1.15 }
  },
  init() {
    const el = this.el;
    el.classList.add('gaze-target');
    this.baseScale = el.getAttribute('scale') || { x: 1, y: 1, z: 1 };

    el.addEventListener('gaze-enter', () => {
      el.setAttribute('animation__hover', {
        property: 'scale',
        to: `${this.baseScale.x * this.data.hoverScale} ${this.baseScale.y * this.data.hoverScale} ${this.baseScale.z * this.data.hoverScale}`,
        dur: 200, easing: 'easeOutQuad'
      });
    });
    el.addEventListener('gaze-leave', () => {
      el.setAttribute('animation__hover', {
        property: 'scale',
        to: `${this.baseScale.x} ${this.baseScale.y} ${this.baseScale.z}`,
        dur: 200, easing: 'easeOutQuad'
      });
    });
  }
});
