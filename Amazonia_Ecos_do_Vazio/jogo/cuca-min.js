/* CUCA v4 — Estilizada e uniforme (paleta única, peças maiores, low-poly limpo) */
AFRAME.registerComponent('cuca-min', {
  init: function () {
    var el = this.el;

    // PALETA UNIFICADA
    var COR = {
      pele:     '#6BAE3F',  // verde-jacaré
      peleEsc:  '#3D5F1F',  // verde escuro (sombras, espinhos, sobrancelha)
      cabelo:   '#7E8E2A',  // verde-oliva
      vestido:  '#5A2F8E',  // roxo
      vestEsc:  '#4A2570',  // roxo escuro
      faixa:    '#3D2817',  // marrom escuro
      acento:   '#D4A82C',  // amarelo (fivela, garras, olhos)
      preto:    '#1A0F2C',
      sapato:   '#1A0F2C',
      madeira:  '#7A4D26',
      branco:   '#FFF8DC',
      remendo:  '#5C3A1A'
    };
    var MAT_FLAT = 'flatShading: true; roughness: 0.9';

    // ============ VESTIDO (peça única bold) ============
    var dress = document.createElement('a-cone');
    dress.setAttribute('radius-bottom', 0.55);
    dress.setAttribute('radius-top', 0.28);
    dress.setAttribute('height', 1.15);
    dress.setAttribute('segments-radial', 8);
    dress.setAttribute('position', '0 0.575 0');
    dress.setAttribute('color', COR.vestido);
    dress.setAttribute('material', MAT_FLAT);
    el.appendChild(dress);

    // BABADO (3 triângulos grandes na frente e laterais)
    for (var t = 0; t < 6; t++) {
      var ang = (t / 6) * Math.PI * 2;
      var tat = document.createElement('a-cone');
      tat.setAttribute('radius-bottom', 0.13);
      tat.setAttribute('radius-top', 0.03);
      tat.setAttribute('height', 0.2);
      tat.setAttribute('segments-radial', 3);
      tat.setAttribute('position', (Math.cos(ang)*0.52) + ' 0.1 ' + (Math.sin(ang)*0.52));
      tat.setAttribute('rotation', '180 0 0');
      tat.setAttribute('color', COR.vestEsc);
      el.appendChild(tat);
    }

    // CINTO (faixa única horizontal)
    var belt = document.createElement('a-torus');
    belt.setAttribute('radius', 0.33);
    belt.setAttribute('radius-tubular', 0.032);
    belt.setAttribute('segments-radial', 4);
    belt.setAttribute('segments-tubular', 12);
    belt.setAttribute('position', '0 0.8 0');
    belt.setAttribute('rotation', '90 0 0');
    belt.setAttribute('color', COR.preto);
    el.appendChild(belt);

    // REMENDO (caixa única simples)
    var patch = document.createElement('a-box');
    patch.setAttribute('width', 0.11); patch.setAttribute('height', 0.11); patch.setAttribute('depth', 0.01);
    patch.setAttribute('position', '0 0.4 0.42');
    patch.setAttribute('color', COR.remendo);
    el.appendChild(patch);

    // ============ CABEÇA (caixa principal) ============
    var head = document.createElement('a-box');
    head.setAttribute('width', 0.38); head.setAttribute('height', 0.3); head.setAttribute('depth', 0.32);
    head.setAttribute('position', '0 1.4 0');
    head.setAttribute('color', COR.pele);
    head.setAttribute('material', MAT_FLAT);
    el.appendChild(head);

    // FOCINHO (caixa única alongada, sem narinas pequenas)
    var snout = document.createElement('a-box');
    snout.setAttribute('width', 0.26); snout.setAttribute('height', 0.18); snout.setAttribute('depth', 0.35);
    snout.setAttribute('position', '0 1.35 0.33');
    snout.setAttribute('color', COR.pele);
    snout.setAttribute('material', MAT_FLAT);
    el.appendChild(snout);

    // SOBRANCELHAS (2 cunhas verde-escuras grandes)
    var browL = document.createElement('a-box');
    browL.setAttribute('width', 0.13); browL.setAttribute('height', 0.04); browL.setAttribute('depth', 0.05);
    browL.setAttribute('position', '-0.1 1.55 0.17');
    browL.setAttribute('rotation', '0 0 18');
    browL.setAttribute('color', COR.peleEsc);
    el.appendChild(browL);
    var browR = document.createElement('a-box');
    browR.setAttribute('width', 0.13); browR.setAttribute('height', 0.04); browR.setAttribute('depth', 0.05);
    browR.setAttribute('position', '0.1 1.55 0.17');
    browR.setAttribute('rotation', '0 0 -18');
    browR.setAttribute('color', COR.peleEsc);
    el.appendChild(browR);

    // OLHOS (2 esferas amarelas grandes + pupila preta)
    function makeEye(x) {
      var e = document.createElement('a-sphere');
      e.setAttribute('radius', 0.085);
      e.setAttribute('segments-width', 8); e.setAttribute('segments-height', 6);
      e.setAttribute('position', x + ' 1.45 0.17');
      e.setAttribute('color', COR.acento);
      e.setAttribute('material', 'emissive: ' + COR.acento + '; emissiveIntensity: 0.5; flatShading: true');
      el.appendChild(e);
      var p = document.createElement('a-box');
      p.setAttribute('width', 0.025); p.setAttribute('height', 0.07); p.setAttribute('depth', 0.025);
      p.setAttribute('position', x + ' 1.45 0.25');
      p.setAttribute('color', COR.preto);
      el.appendChild(p);
    }
    makeEye(-0.1);
    makeEye(0.1);

    // BOCA (uma caixa preta única)
    var mouth = document.createElement('a-box');
    mouth.setAttribute('width', 0.22); mouth.setAttribute('height', 0.06); mouth.setAttribute('depth', 0.27);
    mouth.setAttribute('position', '0 1.23 0.36');
    mouth.setAttribute('color', COR.preto);
    el.appendChild(mouth);

    // DENTES (4 cones uniformes — 2 em cima + 2 em baixo)
    var teethPos = [
      { x: -0.07, y: 1.24, h: 0.06, rot: '180 0 0' },
      { x:  0.07, y: 1.24, h: 0.06, rot: '180 0 0' },
      { x: -0.05, y: 1.2,  h: 0.05, rot: '0 0 0' },
      { x:  0.05, y: 1.2,  h: 0.05, rot: '0 0 0' }
    ];
    teethPos.forEach(function (tp) {
      var t = document.createElement('a-cone');
      t.setAttribute('radius-bottom', 0.022); t.setAttribute('radius-top', 0.001);
      t.setAttribute('height', tp.h); t.setAttribute('segments-radial', 4);
      t.setAttribute('position', tp.x + ' ' + tp.y + ' 0.46');
      t.setAttribute('rotation', tp.rot);
      t.setAttribute('color', COR.branco);
      el.appendChild(t);
    });

    // ============ CABELO ESTILIZADO (8 mechas grandes uniformes) ============
    // 4 atrás da cabeça (caem pelas costas)
    for (var hb = 0; hb < 4; hb++) {
      var hair = document.createElement('a-cone');
      hair.setAttribute('radius-bottom', 0.13);
      hair.setAttribute('radius-top', 0.02);
      hair.setAttribute('height', 0.85);
      hair.setAttribute('segments-radial', 3);
      var xOff = (hb - 1.5) * 0.13;
      hair.setAttribute('position', xOff + ' 0.85 -0.15');
      hair.setAttribute('rotation', '10 0 ' + (xOff * 30));
      hair.setAttribute('color', COR.cabelo);
      hair.setAttribute('material', MAT_FLAT);
      el.appendChild(hair);
    }
    // 4 nas laterais (saindo de baixo do chapéu)
    var sidePositions = [
      { x: -0.28, z:  0.0, rotZ:  35 },
      { x: -0.22, z: -0.15, rotZ: 25 },
      { x:  0.22, z: -0.15, rotZ: -25 },
      { x:  0.28, z:  0.0, rotZ: -35 }
    ];
    sidePositions.forEach(function (sp) {
      var h = document.createElement('a-cone');
      h.setAttribute('radius-bottom', 0.1);
      h.setAttribute('radius-top', 0.02);
      h.setAttribute('height', 0.7);
      h.setAttribute('segments-radial', 3);
      h.setAttribute('position', sp.x + ' 1.05 ' + sp.z);
      h.setAttribute('rotation', '0 0 ' + sp.rotZ);
      h.setAttribute('color', COR.cabelo);
      h.setAttribute('material', MAT_FLAT);
      el.appendChild(h);
    });

    // ============ CHAPÉU DE BRUXA (3 peças limpas) ============
    var hat = document.createElement('a-cone');
    hat.setAttribute('radius-bottom', 0.32);
    hat.setAttribute('radius-top', 0.02);
    hat.setAttribute('height', 0.7);
    hat.setAttribute('segments-radial', 8);
    hat.setAttribute('position', '0 1.85 -0.04');
    hat.setAttribute('rotation', '-10 0 10');
    hat.setAttribute('color', COR.vestido);
    hat.setAttribute('material', MAT_FLAT);
    el.appendChild(hat);

    var brim = document.createElement('a-cylinder');
    brim.setAttribute('radius', 0.48);
    brim.setAttribute('height', 0.05);
    brim.setAttribute('segments-radial', 10);
    brim.setAttribute('position', '0 1.55 -0.04');
    brim.setAttribute('rotation', '-6 0 5');
    brim.setAttribute('color', COR.vestEsc);
    brim.setAttribute('material', MAT_FLAT);
    el.appendChild(brim);

    var band = document.createElement('a-torus');
    band.setAttribute('radius', 0.25);
    band.setAttribute('radius-tubular', 0.045);
    band.setAttribute('segments-radial', 4);
    band.setAttribute('segments-tubular', 14);
    band.setAttribute('position', '0 1.62 -0.04');
    band.setAttribute('rotation', '85 0 10');
    band.setAttribute('color', COR.faixa);
    el.appendChild(band);

    // FIVELA (caixa amarela com furo)
    var buckle = document.createElement('a-box');
    buckle.setAttribute('width', 0.12); buckle.setAttribute('height', 0.12); buckle.setAttribute('depth', 0.03);
    buckle.setAttribute('position', '0 1.65 0.23');
    buckle.setAttribute('color', COR.acento);
    el.appendChild(buckle);
    var bHole = document.createElement('a-box');
    bHole.setAttribute('width', 0.06); bHole.setAttribute('height', 0.06); bHole.setAttribute('depth', 0.035);
    bHole.setAttribute('position', '0 1.65 0.245');
    bHole.setAttribute('color', COR.faixa);
    el.appendChild(bHole);

    // ============ BRAÇOS + MÃOS ============
    // Esquerdo (segura cajado)
    var armL = document.createElement('a-cylinder');
    armL.setAttribute('radius', 0.06);
    armL.setAttribute('height', 0.6);
    armL.setAttribute('segments-radial', 5);
    armL.setAttribute('position', '-0.35 0.9 0.1');
    armL.setAttribute('rotation', '0 0 15');
    armL.setAttribute('color', COR.pele);
    armL.setAttribute('material', MAT_FLAT);
    el.appendChild(armL);

    var handL = document.createElement('a-box');
    handL.setAttribute('width', 0.14); handL.setAttribute('height', 0.14); handL.setAttribute('depth', 0.14);
    handL.setAttribute('position', '-0.43 0.6 0.1');
    handL.setAttribute('color', COR.pele);
    handL.setAttribute('material', MAT_FLAT);
    el.appendChild(handL);
    // 3 garras amarelas
    for (var gL = -1; gL <= 1; gL++) {
      var clawL = document.createElement('a-cone');
      clawL.setAttribute('radius-bottom', 0.022); clawL.setAttribute('radius-top', 0.001);
      clawL.setAttribute('height', 0.09); clawL.setAttribute('segments-radial', 4);
      clawL.setAttribute('position', (-0.43 + gL * 0.04) + ' 0.5 0.15');
      clawL.setAttribute('rotation', '180 0 0');
      clawL.setAttribute('color', COR.acento);
      el.appendChild(clawL);
    }

    // Direito (estendido)
    var armR = document.createElement('a-cylinder');
    armR.setAttribute('radius', 0.06);
    armR.setAttribute('height', 0.55);
    armR.setAttribute('segments-radial', 5);
    armR.setAttribute('position', '0.35 0.95 0.2');
    armR.setAttribute('rotation', '-30 0 -20');
    armR.setAttribute('color', COR.pele);
    armR.setAttribute('material', MAT_FLAT);
    el.appendChild(armR);

    var handR = document.createElement('a-box');
    handR.setAttribute('width', 0.14); handR.setAttribute('height', 0.14); handR.setAttribute('depth', 0.14);
    handR.setAttribute('position', '0.5 0.72 0.4');
    handR.setAttribute('color', COR.pele);
    handR.setAttribute('material', MAT_FLAT);
    el.appendChild(handR);
    // 3 garras amarelas
    for (var gR = -1; gR <= 1; gR++) {
      var clawR = document.createElement('a-cone');
      clawR.setAttribute('radius-bottom', 0.022); clawR.setAttribute('radius-top', 0.001);
      clawR.setAttribute('height', 0.09); clawR.setAttribute('segments-radial', 4);
      clawR.setAttribute('position', (0.5 + gR * 0.04) + ' 0.68 0.5');
      clawR.setAttribute('rotation', '90 0 0');
      clawR.setAttribute('color', COR.acento);
      el.appendChild(clawR);
    }

    // ============ CAJADO COM PONTA CURVA ============
    var staff = document.createElement('a-cylinder');
    staff.setAttribute('radius', 0.03);
    staff.setAttribute('height', 2.0);
    staff.setAttribute('segments-radial', 5);
    staff.setAttribute('position', '-0.52 1.0 0.1');
    staff.setAttribute('color', COR.madeira);
    staff.setAttribute('material', MAT_FLAT);
    el.appendChild(staff);

    var staffTop = document.createElement('a-torus');
    staffTop.setAttribute('radius', 0.12);
    staffTop.setAttribute('radius-tubular', 0.03);
    staffTop.setAttribute('segments-radial', 4);
    staffTop.setAttribute('segments-tubular', 10);
    staffTop.setAttribute('arc', 270);
    staffTop.setAttribute('position', '-0.52 2.0 0.1');
    staffTop.setAttribute('color', COR.madeira);
    el.appendChild(staffTop);

    // ============ CAUDA (3 segmentos limpos) ============
    var t1 = document.createElement('a-box');
    t1.setAttribute('width', 0.18); t1.setAttribute('height', 0.18); t1.setAttribute('depth', 0.4);
    t1.setAttribute('position', '0 0.4 -0.4');
    t1.setAttribute('color', COR.pele);
    t1.setAttribute('material', MAT_FLAT);
    el.appendChild(t1);

    var t2 = document.createElement('a-box');
    t2.setAttribute('width', 0.13); t2.setAttribute('height', 0.13); t2.setAttribute('depth', 0.32);
    t2.setAttribute('position', '0 0.35 -0.72');
    t2.setAttribute('color', COR.pele);
    t2.setAttribute('material', MAT_FLAT);
    el.appendChild(t2);

    var t3 = document.createElement('a-cone');
    t3.setAttribute('radius-bottom', 0.08); t3.setAttribute('radius-top', 0.005);
    t3.setAttribute('height', 0.35); t3.setAttribute('segments-radial', 4);
    t3.setAttribute('position', '0 0.34 -1.0');
    t3.setAttribute('rotation', '90 0 0');
    t3.setAttribute('color', COR.pele);
    t3.setAttribute('material', MAT_FLAT);
    el.appendChild(t3);

    // ESPINHOS (5 grandes uniformes)
    for (var s = 0; s < 5; s++) {
      var sp = document.createElement('a-cone');
      sp.setAttribute('radius-bottom', 0.05); sp.setAttribute('radius-top', 0.001);
      sp.setAttribute('height', 0.13); sp.setAttribute('segments-radial', 3);
      sp.setAttribute('position', '0 ' + (0.55 - s * 0.012) + ' ' + (-0.3 - s * 0.16));
      sp.setAttribute('color', COR.peleEsc);
      el.appendChild(sp);
    }

    // ============ SAPATOS (caixas pretas limpas) ============
    [-0.13, 0.13].forEach(function (xPos) {
      var shoe = document.createElement('a-box');
      shoe.setAttribute('width', 0.14); shoe.setAttribute('height', 0.13); shoe.setAttribute('depth', 0.22);
      shoe.setAttribute('position', xPos + ' 0.065 0.08');
      shoe.setAttribute('color', COR.sapato);
      shoe.setAttribute('material', MAT_FLAT);
      el.appendChild(shoe);
      // Salto
      var heel = document.createElement('a-box');
      heel.setAttribute('width', 0.05); heel.setAttribute('height', 0.07); heel.setAttribute('depth', 0.05);
      heel.setAttribute('position', xPos + ' 0.035 -0.05');
      heel.setAttribute('color', COR.sapato);
      el.appendChild(heel);
    });
  }
});
