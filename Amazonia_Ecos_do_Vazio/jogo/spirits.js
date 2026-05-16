/**
 * spirits — Cria N esferas luminosas flutuantes ao redor de uma área.
 * Representam fragmentos espirituais da floresta.
 */
AFRAME.registerComponent('spirits', {
  schema: {
    count:  { type: 'number', default: 8 },
    radius: { type: 'number', default: 12 },
    color:  { type: 'color',  default: '#B0E0E6' },
    size:   { type: 'number', default: 0.08 }
  },

  init() {
    const { count, radius, color, size } = this.data;
    for (let i = 0; i < count; i++) {
      const orbit = document.createElement('a-entity');
      const r = radius * (0.4 + Math.random() * 0.6);
      const y = 1 + Math.random() * 5;
      const speed = 6000 + Math.random() * 6000;
      const dir = Math.random() > 0.5 ? 360 : -360;
      orbit.setAttribute('animation', `property: rotation; to: 0 ${dir} 0; loop: true; dur: ${speed}; easing: linear`);

      const spirit = document.createElement('a-sphere');
      spirit.setAttribute('radius', size * (0.7 + Math.random() * 0.6));
      spirit.setAttribute('color', color);
      spirit.setAttribute('material', `emissive: ${color}; emissiveIntensity: 1; shader: flat; opacity: 0.85; transparent: true`);
      spirit.setAttribute('position', `${r} ${y} 0`);

      // Bobbing vertical
      spirit.setAttribute('animation__bob', {
        property: 'position',
        from: `${r} ${y} 0`,
        to:   `${r} ${y + 0.4} 0`,
        dir: 'alternate', loop: true,
        dur: 1500 + Math.random() * 1500,
        easing: 'easeInOutSine'
      });

      orbit.appendChild(spirit);
      this.el.appendChild(orbit);
    }
  }
});
