/**
 * enemy-base — Base genérica para inimigos e chefes.
 * Gerencia vida, dano, morte e estados visuais.
 *
 * Eventos emitidos:
 *   enemy-hit       — quando recebe dano (detail: { damage, hp, maxHp })
 *   enemy-defeated  — quando vida chega a 0
 *
 * Atributos:
 *   hp        — vida atual
 *   maxHp     — vida máxima
 *   damageColor — cor do flash ao receber dano
 *   type      — tipo do inimigo (pássaro | curupira | onça | etc.)
 */
AFRAME.registerComponent('enemy-base', {
  schema: {
    hp:          { type: 'number', default: 50 },
    maxHp:       { type: 'number', default: 50 },
    damageColor: { type: 'color',  default: '#FFFFFF' },
    type:        { type: 'string', default: 'enemy' },
    dropFragment:{ type: 'boolean', default: false }
  },

  init() {
    this.el.classList.add('enemy', 'damageable');
    this.alive = true;
    this.hp = this.data.hp;
    this._origColor = null;
  },

  takeDamage(amount) {
    if (!this.alive) return;
    this.hp = Math.max(0, this.hp - amount);
    this.el.emit('enemy-hit', { damage: amount, hp: this.hp, maxHp: this.data.maxHp });
    this._flash();
    if (this.hp <= 0) this._die();
  },

  _flash() {
    const meshEl = this.el.querySelector('[material]') || this.el;
    const cur = meshEl.getAttribute('material');
    if (cur && !this._origColor && cur.color) this._origColor = cur.color;

    meshEl.setAttribute('material', 'color', this.data.damageColor);
    meshEl.setAttribute('material', 'emissive', this.data.damageColor);
    meshEl.setAttribute('material', 'emissiveIntensity', 1.5);
    setTimeout(() => {
      if (this._origColor) meshEl.setAttribute('material', 'color', this._origColor);
      meshEl.setAttribute('material', 'emissiveIntensity', 0.3);
    }, 100);
  },

  _die() {
    this.alive = false;
    this.el.emit('enemy-defeated', { type: this.data.type });

    // Efeito de purificação: encolhe e desaparece em partículas
    this.el.setAttribute('animation__fade', {
      property: 'scale',
      to: '0.01 0.01 0.01',
      dur: 600,
      easing: 'easeInQuad'
    });
    // Spawn partículas brancas no local
    this._spawnPurificationParticles();

    setTimeout(() => {
      if (this.data.dropFragment) this._dropFragment();
      this.el.parentNode && this.el.parentNode.removeChild(this.el);
    }, 700);
  },

  _spawnPurificationParticles() {
    const pos = this.el.object3D.position;
    const parent = this.el.parentNode;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('a-sphere');
      p.setAttribute('radius', 0.05);
      p.setAttribute('color', '#FFFFFF');
      p.setAttribute('material', 'emissive: #FFFFFF; emissiveIntensity: 1; shader: flat; opacity: 0.9; transparent: true');
      p.setAttribute('position', `${pos.x} ${pos.y + 0.5} ${pos.z}`);
      const dx = (Math.random() - 0.5) * 2;
      const dy = Math.random() * 1.5;
      const dz = (Math.random() - 0.5) * 2;
      p.setAttribute('animation__move', {
        property: 'position',
        to: `${pos.x + dx} ${pos.y + 0.5 + dy} ${pos.z + dz}`,
        dur: 900, easing: 'easeOutQuad'
      });
      p.setAttribute('animation__fade', {
        property: 'material.opacity', to: 0, dur: 900
      });
      parent.appendChild(p);
      setTimeout(() => p.parentNode && p.parentNode.removeChild(p), 1000);
    }
  },

  _dropFragment() {
    // Fragmento de memória coletável
    const pos = this.el.object3D.position;
    const frag = document.createElement('a-entity');
    frag.setAttribute('fragment', '');
    frag.setAttribute('position', `${pos.x} 1.5 ${pos.z}`);
    this.el.sceneEl.appendChild(frag);
  }
});
