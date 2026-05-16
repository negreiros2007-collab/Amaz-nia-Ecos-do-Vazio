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
    var gLArm   = group(gTorso, -0.22, 0.1, 0);
    var gRArm   = group(gTorso, 0.22, 0.1, 0);
    var gHead   = group(gTorso, 0, 0.5, 0);
    var gHair   = group(gHead, 0, 0, 0);
    var gHat    = group(gHead, 0, 0.38, 0);
    var gTail   = group(root, 0, 0.45, -0.65);

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

    // Pregas verticais (4 linhas escuras descendo pelo vestido)
    for (var pl = 0; pl < 4; pl++) {
      var pang = (pl / 4) * Math.PI * 2 + Math.PI / 8;
      var pleat = document.createElement('a-cylinder');
      pleat.setAttribute('radius', 0.018);
      pleat.setAttribute('height', 1.1);
      pleat.setAttribute('segments-radial', 4);
      pleat.setAttribute('position', (Math.cos(pang) * 0.5) + ' 0.65 ' + (Math.sin(pang) * 0.5));
      pleat.setAttribute('rotation', (Math.sin(pang) * 12) + ' 0 ' + (-Math.cos(pang) * 12));
      pleat.setAttribute('color', COR.vestSomb);
      pleat.setAttribute('material', FLAT);
      gDress.appendChild(pleat);
    }

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
    // BRAÇO ESQUERDO — segura cajado
    // gLArm (local space: origin = shoulder esquerdo)
    // ============================================================
    // Ombro/manga (cone roxo)
    cone(gLArm, 0.14, 0.1, 0.32, 6, 0, -0.16, 0, COR.vestido, { rot: '0 0 14' });
    // Recortes da manga (3 pontinhos pendurados)
    [-0.07, 0, 0.07].forEach(function (xo) {
      cone(gLArm, 0.045, 0.01, 0.1, 3, -0.07 + xo, -0.34, 0, COR.vestEsc, { rot: '180 0 14' });
    });
    // Antebraço (cilindro verde)
    cyl(gLArm, 0.06, 0.35, 6, -0.08, -0.5, 0.04, COR.pele, { rot: '0 0 6' });
    // Mão (palma)
    box(gLArm, 0.14, 0.14, 0.16, -0.1, -0.72, 0.08, COR.pele);
    // 4 garras (amarelas, na frente da mão segurando o cajado)
    for (var gL = 0; gL < 4; gL++) {
      cone(gLArm, 0.022, 0.001, 0.08, 4,
        -0.16 + gL * 0.04,
        -0.81, 0.13,
        COR.acento,
        { rot: '170 0 0' }
      );
    }
    // Polegar (que segura o cajado por baixo)
    box(gLArm, 0.05, 0.1, 0.05, -0.02, -0.72, 0.12, COR.pele, { rot: '0 0 -25' });
    cone(gLArm, 0.022, 0.001, 0.07, 4, 0.01, -0.8, 0.14, COR.acento, { rot: '180 0 0' });

    // ============================================================
    // BRAÇO DIREITO — estendido pra fora, mão aberta na lateral
    // gRArm (local: origin = shoulder direito)
    // ============================================================
    // Ombro/manga (sai pra direita-baixo)
    cone(gRArm, 0.14, 0.1, 0.32, 6, 0.05, -0.15, 0, COR.vestido, { rot: '0 0 -25' });
    // Recortes manga
    [-0.07, 0, 0.07].forEach(function (xo) {
      cone(gRArm, 0.045, 0.01, 0.1, 3, 0.18 + xo, -0.3, 0, COR.vestEsc, { rot: '180 0 -25' });
    });
    // Antebraço — desce reto
    cyl(gRArm, 0.06, 0.38, 6, 0.22, -0.5, 0.05, COR.pele, { rot: '0 0 -8' });
    // Mão aberta na lateral
    box(gRArm, 0.15, 0.14, 0.16, 0.26, -0.72, 0.08, COR.pele);
    // 4 garras apontando pra baixo
    for (var gR = 0; gR < 4; gR++) {
      cone(gRArm, 0.024, 0.001, 0.09, 4,
        0.2 + gR * 0.04,
        -0.82, 0.13,
        COR.acento,
        { rot: '180 0 0' }
      );
    }
    // Polegar
    box(gRArm, 0.05, 0.1, 0.05, 0.34, -0.72, 0.1, COR.pele, { rot: '0 0 20' });
    cone(gRArm, 0.022, 0.001, 0.07, 4, 0.36, -0.8, 0.12, COR.acento, { rot: '180 0 0' });

    // ============================================================
    // CAJADO — segurado pelo braço esquerdo
    // Posicionado em coordenadas globais (root)
    // ============================================================
    var gStaff = group(root, -0.32, 1.0, 0.08);
    cyl(gStaff, 0.035, 2.1, 6, 0, 0, 0, COR.madeira);
    // Gancho no topo
    torus(gStaff, 0.13, 0.035, 4, 14, 300, 0, 1.0, 0, COR.madeira, { rot: '0 0 -30' });

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

    // OLHOS
    function makeEye(x) {
      sphere(gHead, 0.12, x, 0.07, 0.24, COR.acento, { emissive: COR.acento, emInt: 0.6 });
      box(gHead, 0.032, 0.11, 0.03, x, 0.07, 0.35, COR.preto);
      sphere(gHead, 0.024, x + 0.03, 0.1, 0.355, COR.branco, { flat: true });
    }
    makeEye(-0.15);
    makeEye(0.15);

    // BOCA aberta
    box(gHead, 0.34, 0.07, 0.52, 0, -0.2, 0.44, COR.bocaInt);

    // Maxilar inferior
    box(gHead, 0.36, 0.11, 0.5, 0, -0.28, 0.42, COR.pele);

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
    // CABELO — BEM VOLUMOSO, cascateando do lado direito
    // ============================================================
    // CAMADA EXTERNA — cascata grande lado direito (volume controlado)
    var rightCascadeOuter = [
      { x: 0.3,  y: 0.12, z: 0.0,  rot: '0 0 -25', h: 0.4, r: 0.15 },
      { x: 0.34, y: -0.08, z: -0.02, rot: '5 0 -20', h: 0.5, r: 0.16 },
      { x: 0.36, y: -0.3, z: -0.05, rot: '10 0 -12', h: 0.55, r: 0.15 },
      { x: 0.34, y: -0.52, z: -0.1, rot: '12 0 -5', h: 0.5, r: 0.13 },
      { x: 0.28, y: -0.65, z: -0.18, rot: '15 0 8', h: 0.4, r: 0.11 }
    ];
    rightCascadeOuter.forEach(function (m, idx) {
      cone(gHair, m.r, 0.03, m.h, 3, m.x, m.y, m.z, idx % 2 === 0 ? COR.cabelo : COR.cabeloEsc, { rot: m.rot });
    });

    // CAMADA INTERNA — mechas atrás, dando volume traseiro (curtas)
    var rightCascadeInner = [
      { x: 0.2, y: -0.1, z: -0.2, rot: '15 0 -10', h: 0.4, r: 0.12 },
      { x: 0.22, y: -0.35, z: -0.25, rot: '18 0 -3', h: 0.45, r: 0.12 }
    ];
    rightCascadeInner.forEach(function (m, idx) {
      cone(gHair, m.r, 0.025, m.h, 3, m.x, m.y, m.z, idx % 2 === 0 ? COR.cabeloEsc : COR.cabelo, { rot: m.rot });
    });

    // VOLUME TRASEIRO — mechas curtas atrás, contidas no tamanho da cabeça
    var backHair = [
      { x: -0.2, y: 0.0, z: -0.22, rot: '15 0 18',  h: 0.4, r: 0.13 },
      { x: -0.1, y: 0.05, z: -0.25, rot: '12 0 8',   h: 0.42, r: 0.13 },
      { x: 0.0,  y: 0.06, z: -0.27, rot: '10 0 0',   h: 0.42, r: 0.13 },
      { x: 0.1,  y: 0.05, z: -0.25, rot: '12 0 -8',  h: 0.42, r: 0.13 },
      { x: 0.2,  y: 0.0, z: -0.22, rot: '15 0 -18', h: 0.4, r: 0.13 }
    ];
    backHair.forEach(function (m, idx) {
      cone(gHair, m.r, 0.025, m.h, 3, m.x, m.y, m.z, idx % 2 === 0 ? COR.cabeloEsc : COR.cabelo, { rot: m.rot });
    });

    // MECHAS NO LADO ESQUERDO (menores, perto da face)
    var leftHair = [
      { x: -0.26, y: 0.08, z: 0.05, rot: '0 0 30',  h: 0.35, r: 0.1 },
      { x: -0.3,  y: -0.05, z: 0.0, rot: '5 0 25',  h: 0.4,  r: 0.1 },
      { x: -0.32, y: -0.22, z: -0.05, rot: '8 0 15', h: 0.45, r: 0.1 }
    ];
    leftHair.forEach(function (m, idx) {
      cone(gHair, m.r, 0.02, m.h, 3, m.x, m.y, m.z, idx % 2 === 0 ? COR.cabelo : COR.cabeloEsc, { rot: m.rot });
    });

    // FRANJA por baixo do chapéu — visível de frente, sai à frente da testa
    for (var fr = 0; fr < 7; fr++) {
      var fx = -0.22 + fr * 0.075;
      var franja = document.createElement('a-cone');
      franja.setAttribute('radius-bottom', 0.07);
      franja.setAttribute('radius-top', 0.015);
      franja.setAttribute('height', 0.22 + (fr === 3 ? 0.05 : (fr === 1 || fr === 5 ? 0.03 : 0)));
      franja.setAttribute('segments-radial', 3);
      franja.setAttribute('position', fx + ' 0.22 0.23');
      franja.setAttribute('rotation', '170 0 ' + (fx * 50));
      franja.setAttribute('color', fr % 2 === 0 ? COR.cabelo : COR.cabeloEsc);
      franja.setAttribute('material', FLAT);
      gHair.appendChild(franja);
    }

    // ============================================================
    // CHAPÉU (gHat, em cima da cabeça)
    // Origin do gHat = topo do crânio (y=0.32 em gHead). Aba na base.
    // ============================================================
    // Aba (cilindro plano)
    cyl(gHat, 0.45, 0.05, 14, 0, 0, -0.02, COR.vestEsc);
    // Topo da aba
    cyl(gHat, 0.4, 0.025, 14, 0, 0.03, -0.02, COR.vestido);

    // Cone principal — menor, simétrico
    cone(gHat, 0.28, 0.02, 0.7, 8, 0, 0.4, -0.04, COR.vestido, { rot: '-5 0 0' });

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
