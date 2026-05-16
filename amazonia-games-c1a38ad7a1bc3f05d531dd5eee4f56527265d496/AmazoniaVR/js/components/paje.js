/**
 * paje — Pajé Esquecido, guia narrativo do hub.
 * Forma low-poly construída por composição de primitivos.
 * Ao olhar, exibe fala contextual.
 */
AFRAME.registerComponent('paje', {
  init() {
    const el = this.el;

    // Corpo (manto longo cônico)
    const robe = document.createElement('a-cone');
    robe.setAttribute('radius-bottom', 0.5);
    robe.setAttribute('radius-top', 0.18);
    robe.setAttribute('height', 1.4);
    robe.setAttribute('segments-radial', 8);
    robe.setAttribute('position', '0 0.7 0');
    robe.setAttribute('color', '#3D2817');
    robe.setAttribute('material', 'roughness: 0.95');
    el.appendChild(robe);

    // Cabeça
    const head = document.createElement('a-sphere');
    head.setAttribute('radius', 0.16);
    head.setAttribute('position', '0 1.55 0');
    head.setAttribute('color', '#8B5A3C');
    head.setAttribute('segments-width', 12);
    head.setAttribute('segments-height', 8);
    el.appendChild(head);

    // Cocar — 5 plumas verticais
    for (let i = -2; i <= 2; i++) {
      const feather = document.createElement('a-cone');
      feather.setAttribute('radius-bottom', 0.025);
      feather.setAttribute('radius-top', 0.005);
      feather.setAttribute('height', 0.28);
      feather.setAttribute('segments-radial', 4);
      feather.setAttribute('position', `${i * 0.045} 1.85 -0.05`);
      feather.setAttribute('rotation', `${i * -5} 0 0`);
      const colors = ['#D62828', '#F77F00', '#FCBF49', '#F77F00', '#D62828'];
      feather.setAttribute('color', colors[i + 2]);
      el.appendChild(feather);
    }

    // Cajado/bastão
    const staff = document.createElement('a-cylinder');
    staff.setAttribute('radius', 0.025);
    staff.setAttribute('height', 1.5);
    staff.setAttribute('position', '0.4 0.75 0');
    staff.setAttribute('rotation', '0 0 -5');
    staff.setAttribute('color', '#5D4037');
    el.appendChild(staff);

    // Pedra brilhante no topo do cajado
    const stone = document.createElement('a-sphere');
    stone.setAttribute('radius', 0.06);
    stone.setAttribute('position', '0.46 1.5 0');
    stone.setAttribute('color', '#7FFFD4');
    stone.setAttribute('material', 'emissive: #7FFFD4; emissiveIntensity: 0.7');
    stone.setAttribute('animation', 'property: material.emissiveIntensity; from: 0.4; to: 0.9; dir: alternate; loop: true; dur: 1800');
    el.appendChild(stone);

    // Hitbox de interação (gaze)
    const hit = document.createElement('a-cylinder');
    hit.setAttribute('radius', 0.6);
    hit.setAttribute('height', 2);
    hit.setAttribute('position', '0 1 0');
    hit.setAttribute('material', 'opacity: 0; transparent: true');
    hit.classList.add('gaze-target');
    hit.setAttribute('gaze-target', 'hoverScale: 1.05');
    el.appendChild(hit);

    // Falas contextuais
    this.lines = [
      'A floresta não esqueceu de você... ainda.',
      'Cada lenda guarda um pedaço da Mata. Devolva-os.',
      'O Vazio cresce com nosso silêncio.',
      'O totem é a memória — segure-o firme.',
      'As outras lendas aguardam. Vá.'
    ];
    this.currentLine = 0;

    hit.addEventListener('gaze-fire', () => this._speak());
  },

  _speak() {
    const line = this.lines[this.currentLine % this.lines.length];
    this.currentLine++;
    this.el.sceneEl.emit('hub-message', { text: `Pajé: "${line}"` });

    // Tenta TTS nativo do navegador (se suportado)
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(line);
      u.lang = 'pt-BR';
      u.rate = 0.85;
      u.pitch = 0.7;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  }
});
