/**
 * corruption-spot — Foco de Vazio purificável pelo totem.
 * Mancha escura no chão ou em árvores que pode ser purificada com feixe de luz.
 */
AFRAME.registerComponent('corruption-spot', {
  schema: {
    radius: { type: 'number', default: 0.6 }
  },

  init() {
    const el = this.el;
    el.classList.add('damageable', 'corruption');

    // Mancha escura pulsante
    const blob = document.createElement('a-circle');
    blob.setAttribute('radius', this.data.radius);
    blob.setAttribute('rotation', '-90 0 0');
    blob.setAttribute('color', '#1A0033');
    blob.setAttribute('material', 'opacity: 0.85; transparent: true; shader: flat; side: double');
    blob.setAttribute('animation__pulse',
      'property: scale; from: 1 1 1; to: 1.15 1.15 1.15; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine');
    el.appendChild(blob);

    // Núcleo violeta
    const core = document.createElement('a-circle');
    core.setAttribute('radius', this.data.radius * 0.5);
    core.setAttribute('rotation', '-90 0 0');
    core.setAttribute('position', '0 0.01 0');
    core.setAttribute('color', '#330066');
    core.setAttribute('material', 'opacity: 0.9; transparent: true; shader: flat; emissive: #330066');
    el.appendChild(core);

    // Tentáculo vertical de "fumaça" do Vazio
    const tendril = document.createElement('a-cone');
    tendril.setAttribute('radius-bottom', this.data.radius * 0.3);
    tendril.setAttribute('radius-top', 0.05);
    tendril.setAttribute('height', 1.5);
    tendril.setAttribute('position', `0 0.75 0`);
    tendril.setAttribute('color', '#1A0033');
    tendril.setAttribute('material', 'opacity: 0.5; transparent: true; shader: flat');
    tendril.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear');
    el.appendChild(tendril);

    this.hp = 100;
    this.maxHp = 100;
  },

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) this._purify();
  },

  _purify() {
    // Mesma rotina de partículas brancas
    const pos = this.el.object3D.position;
    const parent = this.el.parentNode;
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('a-sphere');
      p.setAttribute('radius', 0.06);
      p.setAttribute('color', '#FFFFE0');
      p.setAttribute('material', 'emissive: #FFFFE0; emissiveIntensity: 1; shader: flat; opacity: 1; transparent: true');
      p.setAttribute('position', `${pos.x} ${pos.y + 0.3} ${pos.z}`);
      p.setAttribute('animation__move', {
        property: 'position',
        to: `${pos.x + (Math.random() - 0.5) * 3} ${pos.y + 2 + Math.random() * 2} ${pos.z + (Math.random() - 0.5) * 3}`,
        dur: 1200, easing: 'easeOutQuad'
      });
      p.setAttribute('animation__fade', {
        property: 'material.opacity', to: 0, dur: 1200
      });
      parent.appendChild(p);
      setTimeout(() => p.parentNode && p.parentNode.removeChild(p), 1300);
    }

    this.el.sceneEl.emit('corruption-purified', { position: pos });
    this.el.parentNode && this.el.parentNode.removeChild(this.el);
  }
});
