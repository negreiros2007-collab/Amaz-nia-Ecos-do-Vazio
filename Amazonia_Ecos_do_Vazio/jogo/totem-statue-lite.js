/* ============================================================================
   TOTEM-STATUE-LITE.JS — Totem ancestral simplificado (~15 primitivos)
   ============================================================================
   Estátua decorativa no cenário (não confundir com o totem-arma do jogador).
   ============================================================================ */
AFRAME.registerComponent('totem-statue-lite', {
  init: function () {
    var el = this.el;

    // BASE (cone fincado no chão)
    var base = document.createElement('a-cone');
    base.setAttribute('radius-bottom', 0.4);
    base.setAttribute('radius-top', 0.45);
    base.setAttribute('height', 0.4);
    base.setAttribute('segments-radial', 8);
    base.setAttribute('position', '0 0.2 0');
    base.setAttribute('color', '#5C3A1A');
    el.appendChild(base);

    // COLUNA (cilindro marrom alto)
    var column = document.createElement('a-cylinder');
    column.setAttribute('radius', 0.35);
    column.setAttribute('height', 1.5);
    column.setAttribute('segments-radial', 8);
    column.setAttribute('position', '0 1.15 0');
    column.setAttribute('color', '#7A4D26');
    el.appendChild(column);

    // FAIXA TEAL no meio
    var band = document.createElement('a-cylinder');
    band.setAttribute('radius', 0.37); band.setAttribute('height', 0.08);
    band.setAttribute('segments-radial', 8);
    band.setAttribute('position', '0 1.15 0');
    band.setAttribute('color', '#4A8B7A');
    el.appendChild(band);

    // LOSANGO VERMELHO frente
    var diamond = document.createElement('a-box');
    diamond.setAttribute('width', 0.16); diamond.setAttribute('height', 0.2); diamond.setAttribute('depth', 0.02);
    diamond.setAttribute('position', '0 1.15 0.37');
    diamond.setAttribute('rotation', '0 0 45');
    diamond.setAttribute('color', '#C04030');
    el.appendChild(diamond);

    // ROSTO INFERIOR (caixa com olhos)
    var face = document.createElement('a-box');
    face.setAttribute('width', 0.7); face.setAttribute('height', 0.5); face.setAttribute('depth', 0.6);
    face.setAttribute('position', '0 2.15 0');
    face.setAttribute('color', '#7A4D26');
    el.appendChild(face);

    // Olhos hexagonais (octahedros amarelos)
    var eyeL = document.createElement('a-octahedron');
    eyeL.setAttribute('radius', 0.1);
    eyeL.setAttribute('position', '-0.16 2.2 0.32');
    eyeL.setAttribute('color', '#D4A82C');
    eyeL.setAttribute('material', 'emissive: #D4A82C; emissiveIntensity: 0.5');
    eyeL.setAttribute('animation',
      'property: material.emissiveIntensity; from: 0.3; to: 0.8; dir: alternate; loop: true; dur: 2000');
    el.appendChild(eyeL);

    var eyeR = document.createElement('a-octahedron');
    eyeR.setAttribute('radius', 0.1);
    eyeR.setAttribute('position', '0.16 2.2 0.32');
    eyeR.setAttribute('color', '#D4A82C');
    eyeR.setAttribute('material', 'emissive: #D4A82C; emissiveIntensity: 0.5');
    eyeR.setAttribute('animation',
      'property: material.emissiveIntensity; from: 0.3; to: 0.8; dir: alternate; loop: true; dur: 2000');
    el.appendChild(eyeR);

    // BOCA vermelha
    var mouth = document.createElement('a-box');
    mouth.setAttribute('width', 0.15); mouth.setAttribute('height', 0.05); mouth.setAttribute('depth', 0.02);
    mouth.setAttribute('position', '0 1.95 0.32');
    mouth.setAttribute('color', '#C04030');
    el.appendChild(mouth);

    // CABEÇA DE PÁSSARO no topo
    var topHead = document.createElement('a-box');
    topHead.setAttribute('width', 0.6); topHead.setAttribute('height', 0.4); topHead.setAttribute('depth', 0.55);
    topHead.setAttribute('position', '0 2.65 0');
    topHead.setAttribute('color', '#5C3A1A');
    el.appendChild(topHead);

    // BICO amarelo
    var beak = document.createElement('a-cone');
    beak.setAttribute('radius-bottom', 0.15); beak.setAttribute('radius-top', 0.005);
    beak.setAttribute('height', 0.3); beak.setAttribute('segments-radial', 4);
    beak.setAttribute('position', '0 2.6 0.45');
    beak.setAttribute('rotation', '90 45 0');
    beak.setAttribute('color', '#D4A82C');
    el.appendChild(beak);

    // ASA ESQUERDA (caixa com animação leve)
    var wingL = document.createElement('a-box');
    wingL.setAttribute('width', 0.5); wingL.setAttribute('height', 0.35); wingL.setAttribute('depth', 0.2);
    wingL.setAttribute('position', '-0.55 2.65 0');
    wingL.setAttribute('color', '#5C3A1A');
    wingL.setAttribute('animation', 'property: rotation; from: 0 0 5; to: 0 0 -5; dir: alternate; loop: true; dur: 3000');
    el.appendChild(wingL);

    // ASA DIREITA
    var wingR = document.createElement('a-box');
    wingR.setAttribute('width', 0.5); wingR.setAttribute('height', 0.35); wingR.setAttribute('depth', 0.2);
    wingR.setAttribute('position', '0.55 2.65 0');
    wingR.setAttribute('color', '#5C3A1A');
    wingR.setAttribute('animation', 'property: rotation; from: 0 0 -5; to: 0 0 5; dir: alternate; loop: true; dur: 3000');
    el.appendChild(wingR);

    // Luz dourada no topo
    var light = document.createElement('a-light');
    light.setAttribute('type', 'point');
    light.setAttribute('color', '#FFD700');
    light.setAttribute('intensity', 0.5);
    light.setAttribute('distance', 5);
    light.setAttribute('position', '0 2.7 0.2');
    el.appendChild(light);
  }
});
