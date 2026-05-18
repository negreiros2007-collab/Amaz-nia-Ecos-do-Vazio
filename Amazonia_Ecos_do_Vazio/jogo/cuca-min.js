/* CUCA v7 — Hierarquia anatômica limpa, proporções mascote */
AFRAME.registerComponent('cuca-min', {
  init: function () {
    var root = this.el;

    var COR = {
      pele:     '#6BAE3F',
      peleClara:'#7BC04A',
      peleEsc:  '#3D5F1F',
      cabelo:   '#7E8E2A',
      cabeloEsc:'#5E6E1F',
      vestido:  '#5A2F8E',
      vestEsc:  '#4A2570',
      vestSomb: '#3A1E5C',
      faixa:    '#3D2817',
      acento:   '#D4A82C',
      preto:    '#1A0F2C',
      sapato:   '#1A0F2C',
      madeira:  '#7A4D26',
      branco:   '#FFF8DC',
      remendo:  '#5C3A1A',
      bocaInt:  '#5C1A2C'
    };
    var FLAT = 'flatShading: true; roughness: 0.95; metalness: 0';

    // ============================================================
    // Helpers
    // ============================================================
    function group(parent, x, y, z, rx, ry, rz) {
      var g = document.createElement('a-entity');
      g.setAttribute('position', x + ' ' + y + ' ' + z);
      if (rx !== undefined) g.setAttribute('rotation', (rx || 0) + ' ' + (ry || 0) + ' ' + (rz || 0));
      parent.appendChild(g);
      return g;
    }
    function box(parent, w, h, d, x, y, z, color, opts) {
      var n = document.createElement('a-box');
      n.setAttribute('width', w);
      n.setAttribute('height', h);
      n.setAttribute('depth', d);
      n.setAttribute('position', x + ' ' + y + ' ' + z);
      n.setAttribute('color', color);
      n.setAttribute('material', FLAT);
      if (opts && opts.rot) n.setAttribute('rotation', opts.rot);
      parent.appendChild(n);
      return n;
    }
    function cone(parent, rb, rt, h, segs, x, y, z, color, opts) {
      var n = document.createElement('a-cone');
      n.setAttribute('radius-bottom', rb);
      n.setAttribute('radius-top', rt);
      n.setAttribute('height', h);
      n.setAttribute('segments-radial', segs);
      n.setAttribute('position', x + ' ' + y + ' ' + z);
      n.setAttribute('color', color);
      n.setAttribute('material', FLAT);
      if (opts && opts.rot) n.setAttribute('rotation', opts.rot);
      parent.appendChild(n);
      return n;
    }
    function cyl(parent, r, h, segs, x, y, z, color, opts) {
      var n = document.createElement('a-cylinder');
      n.setAttribute('radius', r);
      n.setAttribute('height', h);
      n.setAttribute('segments-radial', segs);
      n.setAttribute('position', x + ' ' + y + ' ' + z);
      n.setAttribute('color', color);
      n.setAttribute('material', FLAT);
      if (opts && opts.rot) n.setAttribute('rotation', opts.rot);
      parent.appendChild(n);
      return n;
    }
    function sphere(parent, r, x, y, z, color, opts) {
      var n = document.createElement('a-sphere');
      n.setAttribute('radius', r);
      n.setAttribute('segments-width', 10);
      n.setAttribute('segments-height', 8);
      n.setAttribute('position', x + ' ' + y + ' ' + z);
      n.setAttribute('color', color);
      var mat = FLAT;
      if (opts && opts.emissive) mat += '; emissive: ' + opts.emissive + '; emissiveIntensity: ' + (opts.emInt || 0.5);
      if (opts && opts.flat) mat = 'shader: flat';
      n.setAttribute('material', mat);
      parent.appendChild(n);
      return n;
    }
    function torus(parent, r, rt, segR, segT, arc, x, y, z, color, opts) {
      var n = document.createElement('a-torus');
      n.setAttribute('radius', r);
      n.setAttribute('radius-tubular', rt);
      n.setAttribute('segments-radial', segR);
      n.setAttribute('segments-tubular', segT);
      if (arc) n.setAttribute('arc', arc);
      n.setAttribute('position', x + ' ' + y + ' ' + z);
      n.setAttribute('color', color);
      n.setAttribute('material', FLAT);
      if (opts && opts.rot) n.setAttribute('rotation', opts.rot);
      parent.appendChild(n);
      return n;
    }

    // ============================================================
    // ESTRUTURA HIERÁRQUICA
    // root
    //  ├─ legs (y=0)
    //  ├─ dress
    //  ├─ torso (y=1.2)
    //  │   ├─ leftShoulder ─ leftArm
    //  │   ├─ rightShoulder ─ rightArm
    //  │   └─ head (y=0.45 from torso)
    //  │       ├─ hair
    //  │       └─ hat
    //  └─ tail
    // ============================================================
    var gLegs   = group(root, 0, 0, 0);
    var gDress  = group(root, 0, 0, 0);
    var gTorso  = group(root, 0, 1.2, 0);
    var gLArm   = group(gTorso, -0.32, 0.1, 0);
    var gRArm   = group(gTorso, 0.32, 0.1, 0);
    var gHead   = group(gTorso, 0, 0.5, 0);
    var gHair   = group(gHead, 0, 0, 0);
    var gHat    = group(gHead, 0, 0.24, 0);
    var gTail   = group(root, 0, 0.45, -0.65);

    // ============================================================
    // ANIMAÇÕES IDLE — cada parte com seu próprio ritmo
    // ============================================================
    // CABEÇA — sway lateral suave (olha pros lados) + nod sutil
    gHead.setAttribute('animation__sway', 'property: rotation; from: -3 -8 0; to: 3 8 0; dur: 4200; dir: alternate; loop: true; easing: easeInOutSine');

    // CABELO — segue a cabeça com leve atraso (delay)
    gHair.setAttribute('animation__sway', 'property: rotation; from: 2 -4 0; to: -2 4 0; dur: 4200; dir: alternate; loop: true; easing: easeInOutSine; delay: 200');

    // CAUDA — mexe pra lá e pra cá (lagarto feliz)
    gTail.setAttribute('animation__wag', 'property: rotation; from: 0 -15 0; to: 0 15 0; dur: 1800; dir: alternate; loop: true; easing: easeInOutSine');

    // BRAÇOS — animações nos forearms (definidas mais embaixo, após construção)

    // CHAPÉU — balanço sutil (segue a cabeça)
    gHat.setAttribute('animation__sway', 'property: rotation; from: -1 0 -2; to: 1 0 2; dur: 4200; dir: alternate; loop: true; easing: easeInOutSine');

    // ============================================================
    // PERNAS + SAPATOS (gLegs, mundo y=0..0.3)
    // ============================================================
    [-0.14, 0.14].forEach(function (x) {
      // Perna verde aparecendo abaixo da bainha
      cyl(gLegs, 0.07, 0.2, 6, x, 0.2, 0.05, COR.pele);
      // Sapato (corpo)
      box(gLegs, 0.16, 0.1, 0.2, x, 0.05, 0.08, COR.sapato);
      // Bico (na frente, mais baixo)
      box(gLegs, 0.14, 0.07, 0.06, x, 0.035, 0.21, COR.sapato);
      // Salto
      box(gLegs, 0.05, 0.1, 0.05, x, 0.05, -0.05, COR.sapato);
    });

    // ============================================================
    // VESTIDO (gDress) — cone bell-shape, bainha LISA com borda escura
    // ============================================================
    cone(gDress, 0.78, 0.2, 1.25, 8, 0, 0.68, 0, COR.vestido);

    // Borda escura na bainha
    cyl(gDress, 0.8, 0.12, 14, 0, 0.11, 0, COR.vestEsc);

    // Detalhe de costura
    cyl(gDress, 0.79, 0.02, 14, 0, 0.18, 0, COR.acento);

    // Pregas verticais REMOVIDAS (estavam parecendo espetos)

    // Remendo na frente do vestido
    box(gDress, 0.17, 0.17, 0.012, 0.08, 0.55, 0.5, COR.remendo);
    // Stitching marks
    box(gDress, 0.12, 0.008, 0.005, 0.08, 0.59, 0.51, '#2A1810');
    box(gDress, 0.12, 0.008, 0.005, 0.08, 0.51, 0.51, '#2A1810');
    box(gDress, 0.008, 0.12, 0.005, 0.03, 0.55, 0.51, '#2A1810');
    box(gDress, 0.008, 0.12, 0.005, 0.13, 0.55, 0.51, '#2A1810');

    // Cinto — torus marrom no topo do vestido / cintura
    torus(gDress, 0.32, 0.04, 4, 14, null, 0, 1.15, 0, COR.faixa, { rot: '90 0 0' });

    // ============================================================
    // TORSO (gTorso, mundo y=1.2 a 1.55)
    // ============================================================
    // Caixa do torso (ombros)
    box(gTorso, 0.42, 0.3, 0.32, 0, 0.05, 0, COR.vestido);

    // Decote em V (triângulo verde mostrando pele)
    cone(gTorso, 0.08, 0.001, 0.16, 3, 0, 0.07, 0.17, COR.pele, { rot: '180 0 0' });

    // ============================================================
    // BRAÇO ESQUERDO — bent at elbow, gripping staff at chest level
    // ============================================================
    // Ombreira (sphere amassada como pad do ombro)
    sphere(gLArm, 0.13, 0, 0, 0, COR.vestido);

    // UPPER ARM (manga roxa) — reto, sem inclinação (ombro mais largo já resolve)
    var gLUpper = group(gLArm, 0, 0, 0, 0, 0, 0);
    cone(gLUpper, 0.14, 0.12, 0.3, 6, 0, -0.16, 0, COR.vestido);
    // Cotoveleira
    sphere(gLUpper, 0.1, 0, -0.32, 0, COR.vestEsc);

    // FOREARM — dobrado pra frente, levemente toward staff
    var gLForearm = group(gLUpper, 0, -0.32, 0, -80, -12, 0);
    [-0.06, 0, 0.06].forEach(function (xo) {
      cone(gLForearm, 0.045, 0.008, 0.1, 3, xo, 0.04, 0, COR.vestEsc, { rot: '180 0 0' });
    });
    // Antebraço (cilindro verde GROSSO)
    cyl(gLForearm, 0.08, 0.32, 6, 0, -0.17, 0, COR.pele);
    // Mão GRANDE segurando o cajado
    box(gLForearm, 0.22, 0.2, 0.22, 0, -0.4, 0, COR.pele);
    // 4 garras grandes
    for (var gL = 0; gL < 4; gL++) {
      cone(gLForearm, 0.035, 0.001, 0.13, 4,
        -0.09 + gL * 0.06,
        -0.5, 0.08,
        COR.acento,
        { rot: '180 0 0' });
    }
    // Polegar grande
    box(gLForearm, 0.08, 0.15, 0.08, 0.13, -0.4, 0.04, COR.pele, { rot: '0 0 -25' });
    cone(gLForearm, 0.03, 0.001, 0.1, 4, 0.15, -0.49, 0.05, COR.acento, { rot: '180 0 0' });

    // ============================================================
    // BRAÇO DIREITO — bent at elbow, gesturing forward
    // ============================================================
    // Ombreira
    sphere(gRArm, 0.13, 0, 0, 0, COR.vestido);

    // UPPER ARM (manga roxa) — reto
    var gRUpper = group(gRArm, 0, 0, 0, 0, 0, 0);
    cone(gRUpper, 0.14, 0.12, 0.3, 6, 0, -0.16, 0, COR.vestido);
    // Cotoveleira
    sphere(gRUpper, 0.1, 0, -0.32, 0, COR.vestEsc);

    // FOREARM sub-group
    var gRForearm = group(gRUpper, 0, -0.32, 0, -75, 0, 12);
    [-0.06, 0, 0.06].forEach(function (xo) {
      cone(gRForearm, 0.045, 0.008, 0.1, 3, xo, 0.04, 0, COR.vestEsc, { rot: '180 0 0' });
    });
    // Antebraço verde GROSSO
    cyl(gRForearm, 0.08, 0.32, 6, 0, -0.17, 0, COR.pele);
    // Mão GRANDE (palma aberta)
    box(gRForearm, 0.22, 0.2, 0.22, 0, -0.4, 0, COR.pele);
    // 4 garras grandes
    for (var gR = 0; gR < 4; gR++) {
      cone(gRForearm, 0.035, 0.001, 0.13, 4,
        -0.09 + gR * 0.06,
        -0.5, 0.08,
        COR.acento,
        { rot: '180 0 0' });
    }
    // Polegar grande
    box(gRForearm, 0.08, 0.15, 0.08, -0.13, -0.4, 0.04, COR.pele, { rot: '0 0 25' });
    cone(gRForearm, 0.03, 0.001, 0.1, 4, -0.15, -0.49, 0.05, COR.acento, { rot: '180 0 0' });

    // ============================================================
    // CAJADO — NA FRENTE da Cuca, levemente inclinado
    // ============================================================
    var gStaff = group(root, -0.4, 1.0, 0.4, 0, 0, -8);
    cyl(gStaff, 0.04, 2.2, 6, 0, 0, 0, COR.madeira);
    // Gancho no topo
    torus(gStaff, 0.15, 0.04, 4, 14, 300, 0, 1.05, 0, COR.madeira, { rot: '0 0 -30' });
    // Detalhe — amarração de fita/couro no meio
    torus(gStaff, 0.05, 0.018, 4, 8, null, 0, 0.05, 0, COR.faixa, { rot: '90 0 0' });

    // Animações nos antebraços (sub-grupos recém criados)
    gRForearm.setAttribute('animation__gesture', 'property: rotation; from: -75 0 12; to: -60 0 8; dur: 3200; dir: alternate; loop: true; easing: easeInOutSine');
    gLForearm.setAttribute('animation__sway', 'property: rotation; from: -80 -12 0; to: -78 -12 -2; dur: 2800; dir: alternate; loop: true; easing: easeInOutSine');

    // ============================================================
    // CABEÇA — maior, focinho mais longo
    // ============================================================
    box(gHead, 0.52, 0.42, 0.46, 0, 0, 0, COR.pele);

    // FOCINHO — mais longo e proeminente
    box(gHead, 0.4, 0.26, 0.62, 0, -0.06, 0.42, COR.pele);

    // Topo do focinho (escama elevada)
    box(gHead, 0.24, 0.04, 0.58, 0, 0.11, 0.42, COR.peleClara);

    // Narinas
    box(gHead, 0.032, 0.022, 0.032, -0.065, 0.11, 0.71, COR.preto);
    box(gHead, 0.032, 0.022, 0.032, 0.065, 0.11, 0.71, COR.preto);

    // SOBRANCELHAS
    box(gHead, 0.22, 0.08, 0.08, -0.15, 0.19, 0.23, COR.peleEsc, { rot: '0 0 25' });
    box(gHead, 0.22, 0.08, 0.08, 0.15, 0.19, 0.23, COR.peleEsc, { rot: '0 0 -25' });

    // OLHOS — com piscadas periódicas
    var leftEye = null, rightEye = null;
    function makeEye(x, isLeft) {
      var eye = sphere(gHead, 0.12, x, 0.07, 0.24, COR.acento, { emissive: COR.acento, emInt: 0.6 });
      box(gHead, 0.032, 0.11, 0.03, x, 0.07, 0.35, COR.preto);
      sphere(gHead, 0.024, x + 0.03, 0.1, 0.355, COR.branco, { flat: true });
      // Pisca 2 vezes em sequência (close-open-close-open = 4 iterations alternate)
      eye.setAttribute('animation__blink',
        'property: scale; from: 1 1 1; to: 1 0.1 1; ' +
        'dur: 120; dir: alternate; loop: 4; ' +
        'easing: easeInOutQuad; ' +
        'startEvents: blink' + (isLeft ? 'L' : 'R'));
      if (isLeft) leftEye = eye; else rightEye = eye;
      return eye;
    }
    makeEye(-0.15, true);
    makeEye(0.15, false);

    // Piscar lentamente a cada 5-7 segundos
    var blinkTimer = function () {
      if (leftEye) leftEye.emit('blinkL');
      if (rightEye) rightEye.emit('blinkR');
      setTimeout(blinkTimer, 5000 + Math.random() * 2000);
    };
    setTimeout(blinkTimer, 3000);

    // BOCA aberta — anima abrindo/fechando (mastígia)
    var mouthBox = box(gHead, 0.34, 0.07, 0.52, 0, -0.2, 0.44, COR.bocaInt);
    mouthBox.setAttribute('animation__chew',
      'property: scale; from: 1 1 1; to: 1 0.4 1; dur: 1400; dir: alternate; loop: true; easing: easeInOutSine');

    // Maxilar inferior — sobe junto com a boca fechando
    var maxilar = box(gHead, 0.36, 0.11, 0.5, 0, -0.28, 0.42, COR.pele);
    maxilar.setAttribute('animation__chew',
      'property: position; from: 0 -0.28 0.42; to: 0 -0.24 0.42; dur: 1400; dir: alternate; loop: true; easing: easeInOutSine');

    // DENTES superiores (5)
    [-0.12, -0.06, 0, 0.06, 0.12].forEach(function (x, i) {
      var h = i === 2 ? 0.1 : (i === 0 || i === 4 ? 0.08 : 0.07);
      cone(gHead, 0.028, 0.001, h, 4, x, -0.18, 0.62 + Math.abs(x) * 0.1, COR.branco, { rot: '180 0 0' });
    });
    // DENTES inferiores (4)
    [-0.09, -0.03, 0.03, 0.09].forEach(function (x) {
      cone(gHead, 0.028, 0.001, 0.09, 4, x, -0.24, 0.63, COR.branco);
    });
    // Presa lateral
    cone(gHead, 0.033, 0.001, 0.12, 4, 0.13, -0.24, 0.48, COR.branco);

    // ============================================================
    // CABELO — VOLUMOSO mas NUNCA cobre o rosto (z<0.05 sempre)
    // ============================================================
    // BASE 1 — esfera grande cobrindo o topo/trás do crânio (não a frente)
    var hairBase = document.createElement('a-sphere');
    hairBase.setAttribute('radius', 0.3);
    hairBase.setAttribute('segments-width', 12);
    hairBase.setAttribute('segments-height', 9);
    hairBase.setAttribute('position', '0 0.14 -0.18');
    hairBase.setAttribute('scale', '1.2 0.95 1.1');
    hairBase.setAttribute('color', COR.cabelo);
    hairBase.setAttribute('material', FLAT);
    gHair.appendChild(hairBase);

    // BASE 2 — esfera secundária mais escura (profundidade)
    var hairBase2 = document.createElement('a-sphere');
    hairBase2.setAttribute('radius', 0.28);
    hairBase2.setAttribute('segments-width', 10);
    hairBase2.setAttribute('segments-height', 8);
    hairBase2.setAttribute('position', '0 0.05 -0.24');
    hairBase2.setAttribute('scale', '1.25 0.9 1.1');
    hairBase2.setAttribute('color', COR.cabeloEsc);
    hairBase2.setAttribute('material', FLAT);
    gHair.appendChild(hairBase2);

    // FUNÇÃO PRA GERAR MECHA FINA
    function mecha(x, y, z, rotX, rotY, rotZ, h, r, dark) {
      // Limite de segurança: nunca z > -0.05 (cabelo SEMPRE atrás do rosto)
      if (z > -0.05) z = -0.05;
      cone(gHair,
        r, 0.008, h, 3,
        x, y, z,
        dark ? COR.cabeloEsc : COR.cabelo,
        { rot: rotX + ' ' + rotY + ' ' + rotZ }
      );
    }

    // ====== PRNG (resultado reprodutível) ======
    var seed = 42;
    function rnd() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }
    function rng(min, max) { return min + rnd() * (max - min); }

    // ====== ANEL DE MECHAS — só nas COSTAS e LATERAIS (não na frente) ======
    for (var ring = 0; ring < 12; ring++) {
      var rang = (ring / 12) * Math.PI + Math.PI / 2; // só atrás (z negativo)
      // rang vai de 90° a 270° (lado esquerdo → atrás → lado direito)
      var rx = Math.cos(rang) * 0.28;
      var rz = -Math.abs(Math.sin(rang)) * 0.22 - 0.08;
      var rh = 0.35 + rng(0, 0.2);
      var rr = 0.06 + rng(0, 0.02);
      var tiltOut = Math.atan2(rx, rz) * (180 / Math.PI);
      mecha(rx, 0.1 + rng(-0.05, 0.05), rz, rng(10, 25), tiltOut, 0, rh, rr, ring % 2 === 0);
    }

    // ====== CASCATA LATERAL DIREITA — 16 mechas, todas atrás da linha do rosto ======
    for (var i = 0; i < 16; i++) {
      var t = i / 15;
      var x = 0.26 + rng(-0.06, 0.1);
      var y = 0.05 - t * 0.7 + rng(-0.04, 0.04);
      var z = -0.18 - t * 0.18 + rng(-0.05, 0.05);
      var h = 0.45 + rng(0, 0.25);
      var r = 0.05 + rng(0, 0.025);
      var rotX = rng(0, 25);
      var rotZ = -25 + t * 30 + rng(-15, 15);
      mecha(x, y, z, rotX, rng(-10, 10), rotZ, h, r, i % 2 === 0);
    }

    // ====== VOLUME TRASEIRO — 30 mechas atrás da cabeça ======
    for (var b = 0; b < 30; b++) {
      var bx = rng(-0.28, 0.28);
      var by = rng(-0.25, 0.18);
      var bz = -0.28 + rng(-0.15, 0.05);
      var bh = 0.3 + rng(0, 0.3);
      var br = 0.04 + rng(0, 0.025);
      mecha(bx, by, bz, rng(5, 30), rng(-15, 15), rng(-25, 25), bh, br, b % 2 === 0);
    }

    // ====== MECHAS REBELDES NO TOPO — 10 espigões só atrás/lateral do chapéu ======
    for (var t2 = 0; t2 < 10; t2++) {
      var ang2 = (t2 / 10) * Math.PI + Math.PI / 2;
      var tx = Math.cos(ang2) * 0.22;
      var tz = -Math.abs(Math.sin(ang2)) * 0.18 - 0.05;
      var th = 0.18 + rng(0, 0.15);
      var tr = 0.04 + rng(0, 0.02);
      var tilt = 30 + rng(-10, 10);
      var twist = Math.atan2(-tx, tz) * (180 / Math.PI);
      mecha(tx, 0.3 + rng(-0.05, 0.05), tz, -tilt, twist, rng(-20, 20), th, tr, t2 % 2 === 0);
    }

    // ====== LATERAL ESQUERDA — 10 mechas, atrás da linha do rosto ======
    for (var l = 0; l < 10; l++) {
      var lx = -0.24 + rng(-0.07, 0.04);
      var ly = 0.05 - l * 0.08 + rng(-0.04, 0.04);
      var lz = -0.15 + rng(-0.12, 0.05);
      var lh = 0.3 + rng(0, 0.2);
      var lr = 0.04 + rng(0, 0.02);
      mecha(lx, ly, lz, rng(5, 20), rng(-15, 15), 20 + rng(-15, 15), lh, lr, l % 2 === 0);
    }

    // ====== MECHINHAS CURTAS — 15 espalhadas, atrás ======
    for (var r2 = 0; r2 < 15; r2++) {
      var rxx = rng(-0.32, 0.32);
      var ryy = rng(-0.1, 0.3);
      var rzz = -0.22 + rng(-0.12, 0.06);
      var rhh = 0.12 + rng(0, 0.15);
      var rrr = 0.025 + rng(0, 0.02);
      mecha(rxx, ryy, rzz, rng(-30, 30), rng(-180, 180), rng(-60, 60), rhh, rrr, r2 % 2 === 0);
    }

    // ============================================================
    // CHAPÉU (gHat, em cima da cabeça)
    // Origin do gHat = topo do crânio (y=0.32 em gHead). Aba na base.
    // ============================================================
    // Aba (cilindro plano)
    cyl(gHat, 0.45, 0.05, 14, 0, 0, -0.02, COR.vestEsc);
    // Topo da aba
    cyl(gHat, 0.4, 0.025, 14, 0, 0.03, -0.02, COR.vestido);

    // Cone principal — menor, simétrico, ponta fechada
    cone(gHat, 0.28, 0.001, 0.7, 8, 0, 0.4, -0.04, COR.vestido, { rot: '-5 0 0' });

    // Faixa marrom em volta da BASE do cone
    torus(gHat, 0.29, 0.05, 4, 16, null, 0, 0.1, -0.02, COR.faixa, { rot: '90 0 0' });
    box(gHat, 0.58, 0.1, 0.04, 0, 0.1, 0.28, COR.faixa);

    // FIVELA
    var bx = 0, by = 0.1, bz = 0.3;
    box(gHat, 0.13, 0.025, 0.025, bx, by + 0.045, bz, COR.acento);
    box(gHat, 0.13, 0.025, 0.025, bx, by - 0.045, bz, COR.acento);
    box(gHat, 0.025, 0.13, 0.025, bx - 0.05, by, bz, COR.acento);
    box(gHat, 0.025, 0.13, 0.025, bx + 0.05, by, bz, COR.acento);

    // ============================================================
    // CAUDA — menor, ATRÁS, curvada
    // ============================================================
    box(gTail, 0.2, 0.18, 0.32, 0, 0, 0, COR.pele);
    box(gTail, 0.16, 0.15, 0.32, 0.04, -0.04, -0.28, COR.pele, { rot: '0 -15 0' });
    box(gTail, 0.13, 0.12, 0.28, 0.12, -0.08, -0.5, COR.pele, { rot: '0 -25 0' });
    box(gTail, 0.1, 0.1, 0.24, 0.2, -0.12, -0.68, COR.pele, { rot: '0 -35 0' });
    cone(gTail, 0.06, 0.005, 0.22, 4, 0.3, -0.16, -0.78, COR.pele, { rot: '70 -45 0' });

    var spinePath = [
      { x: 0,    y: 0.12, z: 0.1,  s: 0.13 },
      { x: 0.02, y: 0.11, z: -0.05, s: 0.12 },
      { x: 0.05, y: 0.1,  z: -0.2,  s: 0.11 },
      { x: 0.09, y: 0.08, z: -0.36, s: 0.1 },
      { x: 0.14, y: 0.05, z: -0.52, s: 0.09 },
      { x: 0.2,  y: 0.02, z: -0.66, s: 0.08 }
    ];
    spinePath.forEach(function (s) {
      cone(gTail, s.s * 0.45, 0.001, s.s, 3, s.x, s.y, s.z, COR.peleEsc);
    });
  }
});
