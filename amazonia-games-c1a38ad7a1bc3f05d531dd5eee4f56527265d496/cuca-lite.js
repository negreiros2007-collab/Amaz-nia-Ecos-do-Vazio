/* ============================================================================
   CUCA-LITE.JS — Versão LEVE da Cuca (~25 primitivos)
   ============================================================================
   Bruxa-jacaré simplificada para não sobrecarregar.
   ============================================================================ */
AFRAME.registerComponent('cuca-lite', {
  init: function () {
    var el = this.el;

    // VESTIDO (cone roxo)
    var dress = document.createElement('a-cone');
    dress.setAttribute('radius-bottom', 0.45);
    dress.setAttribute('radius-top', 0.22);
    dress.setAttribute('height', 1.0);
    dress.setAttribute('segments-radial', 8);
    dress.setAttribute('position', '0 0.5 0');
    dress.setAttribute('color', '#4A2E7A');
    el.appendChild(dress);

    // CABEÇA (caixa verde)
    var head = document.createElement('a-box');
    head.setAttribute('width', 0.3); head.setAttribute('height', 0.25); head.setAttribute('depth', 0.3);
    head.setAttribute('position', '0 1.3 0');
    head.setAttribute('color', '#6BAE3F');
    el.appendChild(head);

    // FOCINHO (caixa pra frente)
    var snout = document.createElement('a-box');
    snout.setAttribute('width', 0.2); snout.setAttribute('height', 0.15); snout.setAttribute('depth', 0.3);
    snout.setAttribute('position', '0 1.26 0.28');
    snout.setAttribute('color', '#6BAE3F');
    el.appendChild(snout);

    // OLHO ESQUERDO (esfera amarela)
    var eyeL = document.createElement('a-sphere');
    eyeL.setAttribute('radius', 0.06);
    eyeL.setAttribute('position', '-0.07 1.4 0.14');
    eyeL.setAttribute('color', '#FFE034');
    eyeL.setAttribute('material', 'emissive: #FFD700; emissiveIntensity: 0.6; shader: flat');
    el.appendChild(eyeL);
    // OLHO DIREITO
    var eyeR = document.createElement('a-sphere');
    eyeR.setAttribute('radius', 0.06);
    eyeR.setAttribute('position', '0.07 1.4 0.14');
    eyeR.setAttribute('color', '#FFE034');
    eyeR.setAttribute('material', 'emissive: #FFD700; emissiveIntensity: 0.6; shader: flat');
    el.appendChild(eyeR);

    // BOCA (caixa preta)
    var mouth = document.createElement('a-box');
    mouth.setAttribute('width', 0.18); mouth.setAttribute('height', 0.04); mouth.setAttribute('depth', 0.2);
    mouth.setAttribute('position', '0 1.17 0.32');
    mouth.setAttribute('color', '#1A0010');
    el.appendChild(mouth);

    // 3 DENTES
    for (var t = -1; t <= 1; t++) {
      var tooth = document.createElement('a-cone');
      tooth.setAttribute('radius-bottom', 0.015); tooth.setAttribute('radius-top', 0.001);
      tooth.setAttribute('height', 0.04); tooth.setAttribute('segments-radial', 4);
      tooth.setAttribute('position', (t * 0.05) + ' 1.18 0.38');
      tooth.setAttribute('rotation', '180 0 0');
      tooth.setAttribute('color', '#FFFFFF');
      el.appendChild(tooth);
    }

    // CHAPÉU DE BRUXA (cone roxo)
    var hat = document.createElement('a-cone');
    hat.setAttribute('radius-bottom', 0.27);
    hat.setAttribute('radius-top', 0.02);
    hat.setAttribute('height', 0.5);
    hat.setAttribute('segments-radial', 8);
    hat.setAttribute('position', '0 1.7 -0.02');
    hat.setAttribute('rotation', '-8 0 5');
    hat.setAttribute('color', '#5A2F8E');
    el.appendChild(hat);

    // ABA DO CHAPÉU
    var brim = document.createElement('a-cylinder');
    brim.setAttribute('radius', 0.4); brim.setAttribute('height', 0.03);
    brim.setAttribute('segments-radial', 10);
    brim.setAttribute('position', '0 1.45 -0.02');
    brim.setAttribute('rotation', '-5 0 3');
    brim.setAttribute('color', '#4A2570');
    el.appendChild(brim);

    // FIVELA DO CHAPÉU (caixa amarela)
    var buckle = document.createElement('a-box');
    buckle.setAttribute('width', 0.07); buckle.setAttribute('height', 0.07); buckle.setAttribute('depth', 0.015);
    buckle.setAttribute('position', '0 1.52 0.2');
    buckle.setAttribute('color', '#FFD700');
    el.appendChild(buckle);

    // CABELO (5 cones verdes pendurados)
    for (var h = 0; h < 5; h++) {
      var hair = document.createElement('a-cone');
      hair.setAttribute('radius-bottom', 0.04); hair.setAttribute('radius-top', 0.005);
      hair.setAttribute('height', 0.3);
      hair.setAttribute('segments-radial', 4);
      hair.setAttribute('position', ((h - 2) * 0.06) + ' 1.15 -0.18');
      hair.setAttribute('rotation', '20 0 0');
      hair.setAttribute('color', '#7E8E2A');
      el.appendChild(hair);
    }

    // CAUDA (1 cone na parte de trás)
    var tail = document.createElement('a-cone');
    tail.setAttribute('radius-bottom', 0.1); tail.setAttribute('radius-top', 0.02);
    tail.setAttribute('height', 0.7); tail.setAttribute('segments-radial', 5);
    tail.setAttribute('position', '0 0.3 -0.5');
    tail.setAttribute('rotation', '90 0 0');
    tail.setAttribute('color', '#6BAE3F');
    el.appendChild(tail);

    // CAJADO da Cuca (cilindro marrom)
    var staff = document.createElement('a-cylinder');
    staff.setAttribute('radius', 0.025); staff.setAttribute('height', 1.7);
    staff.setAttribute('position', '-0.42 0.9 0.05');
    staff.setAttribute('color', '#7A4D26');
    el.appendChild(staff);

    // PEDRA DO CAJADO (esfera turquesa)
    var orb = document.createElement('a-sphere');
    orb.setAttribute('radius', 0.05);
    orb.setAttribute('position', '-0.42 1.8 0.05');
    orb.setAttribute('color', '#7FFFD4');
    orb.setAttribute('material', 'emissive: #7FFFD4; emissiveIntensity: 0.8; shader: flat');
    orb.setAttribute('animation', 'property: material.emissiveIntensity; from: 0.5; to: 1; dir: alternate; loop: true; dur: 1500');
    el.appendChild(orb);

    // HITBOX
    var hit = document.createElement('a-cylinder');
    hit.setAttribute('radius', 0.6); hit.setAttribute('height', 2);
    hit.setAttribute('position', '0 1 0');
    hit.setAttribute('material', 'opacity: 0; transparent: true');
    hit.classList.add('gaze-target');
    el.appendChild(hit);

    // FALAS COM VOZ DE BRUXA
    this.lines = [
      'Achou que estava sozinha aqui, criança? Hehehe...',
      'O Vazio devora tudo. Até as lendas que me geraram.',
      'Cuidado com o Curupira. Os pés apontam pra trás, mas a fome vem na sua direção.',
      'Olhe para baixo para caminhar. A mata guia seus pés.'
    ];
    this.idx = 0;
    var self = this;
    hit.addEventListener('click', function () { self._speak(); });

    if (typeof AFRAME.components['gaze-target'] !== 'undefined') {
      hit.setAttribute('gaze-target', '');
      hit.addEventListener('gaze-fire', function () { self._speak(); });
    }
  },

  _speak: function () {
    var line = this.lines[this.idx % this.lines.length];
    this.idx++;
    if (this.el.sceneEl) {
      this.el.sceneEl.emit('hub-message', { text: 'Cuca: "' + line + '"' });
    }
    if ('speechSynthesis' in window) {
      var u = new SpeechSynthesisUtterance(line);
      u.lang = 'pt-BR'; u.rate = 0.75; u.pitch = 0.55;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  }
});
