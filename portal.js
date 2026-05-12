/**
 * portal — Portal espiritual para uma arena.
 * Aparência: anel/oval místico flutuante com partículas + cor temática.
 *
 * Atributos:
 *   destination — string: rota da arena (mata-viva | rio-esquecido | floresta-cinzas | floresta-quebrada | vazio)
 *   color       — cor temática
 *   label       — nome da arena (exibido ao olhar)
 *   locked      — true se ainda não desbloqueado
 */
AFRAME.registerComponent('portal', {
  schema: {
    destination: { type: 'string', default: '' },
    color:       { type: 'color',  default: '#7FFFD4' },
    label:       { type: 'string', default: 'Arena' },
    locked:      { type: 'boolean', default: false }
  },

  init() {
    const el = this.el;
    const c = this.data.color;

    // Anel místico exterior
    const ring = document.createElement('a-torus');
    ring.setAttribute('radius', 1.2);
    ring.setAttribute('radius-tubular', 0.08);
    ring.setAttribute('segments-radial', 8);
    ring.setAttribute('segments-tubular', 24);
    ring.setAttribute('color', c);
    ring.setAttribute('material', `emissive: ${c}; emissiveIntensity: 0.7; metalness: 0.3`);
    ring.setAttribute('animation', 'property: rotation; to: 0 0 360; loop: true; dur: 8000; easing: linear');
    el.appendChild(ring);

    // Disco interno semitransparente (efeito de “portal”)
    const disc = document.createElement('a-circle');
    disc.setAttribute('radius', 1.1);
    disc.setAttribute('color', c);
    disc.setAttribute('material', `emissive: ${c}; emissiveIntensity: 0.4; opacity: 0.35; transparent: true; side: double; shader: flat`);
    disc.setAttribute('animation__pulse',
      'property: material.opacity; from: 0.25; to: 0.55; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine');
    el.appendChild(disc);

    // Anel interno menor giratório
    const innerRing = document.createElement('a-torus');
    innerRing.setAttribute('radius', 0.85);
    innerRing.setAttribute('radius-tubular', 0.03);
    innerRing.setAttribute('segments-radial', 6);
    innerRing.setAttribute('segments-tubular', 18);
    innerRing.setAttribute('color', '#FFFFFF');
    innerRing.setAttribute('material', `emissive: #FFFFFF; emissiveIntensity: 0.5`);
    innerRing.setAttribute('animation', 'property: rotation; to: 0 0 -360; loop: true; dur: 5000; easing: linear');
    el.appendChild(innerRing);

    // Hitbox de gaze (plano invisível clicável)
    const hit = document.createElement('a-circle');
    hit.setAttribute('radius', 1.2);
    hit.setAttribute('material', 'opacity: 0; transparent: true');
    hit.classList.add('gaze-target');
    hit.setAttribute('gaze-target', '');
    el.appendChild(hit);

    // Rótulo flutuante (aparece ao olhar)
    const label = document.createElement('a-text');
    label.setAttribute('value', this.data.locked ? `${this.data.label} (?)` : this.data.label);
    label.setAttribute('align', 'center');
    label.setAttribute('color', '#FFFFFF');
    label.setAttribute('width', 4);
    label.setAttribute('position', '0 1.8 0');
    label.setAttribute('visible', false);
    el.appendChild(label);
    this.label = label;

    // Efeito “cadeado” se locked
    if (this.data.locked) {
      ring.setAttribute('material', 'color: #555555; emissive: #222222; opacity: 0.6; transparent: true');
      disc.setAttribute('material', 'color: #333333; opacity: 0.3; transparent: true');
    }

    // Eventos
    hit.addEventListener('gaze-enter',  () => label.setAttribute('visible', true));
    hit.addEventListener('gaze-leave',  () => label.setAttribute('visible', false));
    hit.addEventListener('gaze-fire',   () => this._activate());
  },

  _activate() {
    if (this.data.locked) {
      this.el.sceneEl.emit('hub-message', { text: 'Este caminho ainda não se abriu para você.' });
      return;
    }
    this.el.sceneEl.emit('portal-activate', { destination: this.data.destination });
  }
});
