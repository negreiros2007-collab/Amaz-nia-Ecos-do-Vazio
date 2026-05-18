/* ============================================================================
   DENSE-FOREST.JS — Componente A-Frame de floresta estilizada completa
   ============================================================================
   Cria uma floresta noturna inteira em volta da câmera:
   - 3 camadas de árvores (pinheiros, frondosas com vento, silhuetas distantes)
   - Samambaias, grama, flores silvestres, cogumelos, pedras, troncos caídos
   - Manchas de chão para textura visual
   - Vaga-lumes flutuantes

   Uso simples:
   <a-entity dense-forest></a-entity>

   Com parâmetros:
   <a-entity dense-forest="trees: 50; minRadius: 12; maxRadius: 22;
                           fireflies: 20; flowers: 30"></a-entity>

   Schema:
   - trees:       número de árvores no anel médio (default 50)
   - minRadius:   raio mínimo do anel médio (default 12)
   - maxRadius:   raio máximo do anel médio (default 22)
   - pines:       pinheiros do anel interno (default 11)
   - frondosas:   árvores frondosas (default 9)
   - silhouettes: silhuetas distantes (default 36)
   - ferns:       samambaias (default 25)
   - flowers:     flores silvestres (default 30)
   - mushrooms:   cogumelos mágicos (default 8)
   - rocks:       pedras espalhadas (default 15)
   - logs:        troncos caídos (default 3)
   - grass:       tufos de grama (default 40)
   - fireflies:   vaga-lumes flutuantes (default 22)
   - patches:     manchas de chão (default 20)
   - stars:       quantidade de estrelas no céu (default 120, só com nightMode)
   - nightMode:   ativa céu escuro, fog, lua, luas e estrelas automaticamente (default TRUE)
                  — desativa com nightMode: false se você já tem seu próprio céu/iluminacão
   - clearingX/Z: centro da clareira (não planta nada perto) — default 0, -3
   - clearingR:   raio da clareira protegida (default 2.5)
   ============================================================================ */

AFRAME.registerComponent('dense-forest', {
  schema: {
    trees:       { type: 'number', default: 50 },
    minRadius:   { type: 'number', default: 12 },
    maxRadius:   { type: 'number', default: 22 },
    pines:       { type: 'number', default: 11 },
    frondosas:   { type: 'number', default: 9 },
    silhouettes: { type: 'number', default: 36 },
    ferns:       { type: 'number', default: 25 },
    flowers:     { type: 'number', default: 30 },
    mushrooms:   { type: 'number', default: 8 },
    rocks:       { type: 'number', default: 15 },
    logs:        { type: 'number', default: 3 },
    grass:       { type: 'number', default: 40 },
    fireflies:   { type: 'number', default: 22 },
    patches:     { type: 'number', default: 20 },
    stars:       { type: 'number', default: 120 },
    clearingX:   { type: 'number', default: 0 },
    clearingZ:   { type: 'number', default: -3 },
    clearingR:   { type: 'number', default: 2.5 },
    nightMode:   { type: 'boolean', default: true }
  },

  init: function () {
    var el = this.el;
    var d = this.data;

    // ====== Helpers DOM ======
    function mk(tag, attrs, parent) {
      var n = document.createElement(tag);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      (parent || el).appendChild(n);
      return n;
    }
    function rand(min, max) { return min + Math.random() * (max - min); }
    function rng(max) { return Math.random() * max; }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function distToClearing(x, z) {
      var dx = x - d.clearingX;
      var dz = z - d.clearingZ;
      return Math.sqrt(dx * dx + dz * dz);
    }

    // ====================================================================
    // MODO NOITE — céu, fog, lua, luas e estrelas (ativado por padrão)
    // ====================================================================
    if (d.nightMode) {
      var scene = el.sceneEl;
      // Aplica fog e background no <a-scene>
      scene.setAttribute('fog', 'type: exponential; color: #1a0f2c; density: 0.055');
      scene.setAttribute('background', 'color: #0a0518');

      // FORÇA céu noturno (remove qualquer sky pré-existente)
      var oldSkies = scene.querySelectorAll('a-sky, [primitive="a-sky"]');
      oldSkies.forEach(function (s) { s.parentNode.removeChild(s); });
      mk('a-sky', { 'color': '#0a0518' }, scene);

      // FORÇA escurecer luzes pré-existentes (reduz intensidade da app original)
      var oldLights = scene.querySelectorAll('a-light, [light]');
      oldLights.forEach(function (lt) {
        // Reduz intensidade pela metade — não remove pra manter setup do jogo
        var curr = parseFloat(lt.getAttribute('intensity') || lt.components.light?.data.intensity || 1);
        if (curr > 0.3) lt.setAttribute('intensity', curr * 0.3);
      });

      // LUA + 3 halos
      var moonGroup = mk('a-entity', { 'position': '-10 11 -16' }, scene);
      mk('a-sphere', {
        'radius': 1.6, 'color': '#FFF8DC',
        'material': 'emissive: #FFF8DC; emissiveIntensity: 0.95; flatShading: true; shader: flat'
      }, moonGroup);
      mk('a-ring', {
        'radius-inner': 1.7, 'radius-outer': 2.3,
        'position': '0 0 -0.1',
        'color': '#FFF8DC', 'opacity': 0.25,
        'material': 'side: double; shader: flat'
      }, moonGroup);
      mk('a-ring', {
        'radius-inner': 2.4, 'radius-outer': 3.4,
        'position': '0 0 -0.2',
        'color': '#D4A82C', 'opacity': 0.1,
        'material': 'side: double; shader: flat'
      }, moonGroup);
      mk('a-ring', {
        'radius-inner': 3.5, 'radius-outer': 5,
        'position': '0 0 -0.3',
        'color': '#5A2F8E', 'opacity': 0.06,
        'material': 'side: double; shader: flat'
      }, moonGroup);

      // LUZES NOTURNAS — sempre adiciona ambient roxa + direcional azulada
      mk('a-light', { 'type': 'ambient', 'color': '#4a3a7a', 'intensity': 0.55 }, scene);
      mk('a-light', { 'type': 'directional', 'color': '#b8c4ff', 'intensity': 0.7, 'position': '-4 8 -3' }, scene);

      // ESTRELAS
      for (var sti = 0; sti < d.stars; sti++) {
        var stheta = rng(Math.PI * 2);
        var sphi = rng(Math.PI * 0.5);
        var sr = 35;
        var sxx = sr * Math.sin(sphi) * Math.cos(stheta);
        var syy = sr * Math.cos(sphi) + 1;
        var szz = sr * Math.sin(sphi) * Math.sin(stheta);
        var scol = Math.random() > 0.7 ? '#D4A82C' : (Math.random() > 0.5 ? '#FFF8DC' : '#C8A4FF');
        var sAttrs = {
          'radius': 0.05 + rng(0.1),
          'segments-width': 4, 'segments-height': 3,
          'position': sxx + ' ' + syy + ' ' + szz,
          'color': scol,
          'material': 'emissive: ' + scol + '; emissiveIntensity: ' + (0.8 + rng(0.5)) + '; shader: flat'
        };
        if (sti % 4 === 0) {
          sAttrs['animation'] = 'property: material.opacity; from: 0.4; to: 1; dur: ' + (1200 + rng(2400)) + '; dir: alternate; loop: true';
        }
        mk('a-sphere', sAttrs, scene);
      }
    }

    // ====================================================================
    // CAMADA 1: ANEL INTERMEDIÁRIO (árvores principais — 50 simples)
    // Mantida a estrutura original para retrocompatibilidade
    // ====================================================================
    for (var i = 0; i < d.trees; i++) {
      var ang = (i / d.trees) * Math.PI * 2 + rng(0.2);
      var dist = d.minRadius + rng(d.maxRadius - d.minRadius);
      var x = Math.cos(ang) * dist;
      var z = Math.sin(ang) * dist;
      var h = 4 + rng(3);

      mk('a-cylinder', {
        'radius': 0.25, 'height': h, 'segments-radial': 5,
        'position': x + ' ' + (h / 2) + ' ' + z,
        'color': '#3E2723'
      });

      var shades = ['#1F4020', '#2E5D31', '#3F7042', '#264C28'];
      mk('a-sphere', {
        'radius': 1.4 + rng(0.4),
        'segments-width': 6, 'segments-height': 4,
        'position': x + ' ' + (h + 0.7) + ' ' + z,
        'color': shades[i % 4]
      });
    }

    // ====================================================================
    // CAMADA 2: PINHEIROS ESTILIZADOS (anel interno, próximos)
    // ====================================================================
    var pinePos = [
      { x: -6, z: -8 }, { x: 7, z: -10 }, { x: -9, z: -3 },
      { x: 8, z: -2 }, { x: -5, z: 5 }, { x: 6, z: 7 },
      { x: -8, z: 9 }, { x: 10, z: 4 }, { x: 0, z: -12 },
      { x: -3, z: 11 }, { x: 4, z: 10 }
    ];
    for (var pi = 0; pi < Math.min(d.pines, pinePos.length); pi++) {
      var p = pinePos[pi];
      var pscale = 0.9 + rng(0.4);
      var tree = mk('a-entity', {
        'position': p.x + ' 0 ' + p.z,
        'rotation': '0 ' + rng(360) + ' 0',
        'scale': pscale + ' ' + pscale + ' ' + pscale
      });
      mk('a-cylinder', {
        'radius': 0.22, 'height': 2.4, 'segments-radial': 5,
        'position': '0 1.2 0',
        'color': '#2A1810',
        'material': 'flatShading: true; shader: flat'
      }, tree);
      var pineColors = ['#1F3A1F', '#2E5530'];
      for (var k = 0; k < 2; k++) {
        mk('a-cone', {
          'radius-bottom': 1.5 - k * 0.4, 'radius-top': 0,
          'height': 1.8, 'segments-radial': 6,
          'position': '0 ' + (2.2 + k * 0.9) + ' 0',
          'color': pineColors[k],
          'material': 'flatShading: true; shader: flat'
        }, tree);
      }
    }

    // ====================================================================
    // CAMADA 3: ÁRVORES FRONDOSAS (variedade — copas de esferas, com vento)
    // ====================================================================
    var frondPos = [
      { x: -7, z: -6, s: 1.1 }, { x: 6, z: -8, s: 1.0 },
      { x: -10, z: 0, s: 1.2 }, { x: 9, z: 2, s: 1.0 },
      { x: -4, z: 7, s: 0.9 }, { x: 5, z: 9, s: 1.1 },
      { x: -8, z: -12, s: 1.0 }, { x: 11, z: -6, s: 0.95 },
      { x: 0, z: -10, s: 0.85 }
    ];
    for (var fi = 0; fi < Math.min(d.frondosas, frondPos.length); fi++) {
      var fp = frondPos[fi];
      var fTree = mk('a-entity', {
        'position': fp.x + ' 0 ' + fp.z,
        'rotation': '0 ' + rng(360) + ' 0',
        'scale': fp.s + ' ' + fp.s + ' ' + fp.s
      });
      mk('a-cylinder', {
        'radius': 0.3, 'height': 3.2, 'segments-radial': 6,
        'position': '0 1.6 0',
        'rotation': rand(-3, 3) + ' 0 ' + rand(-3, 3),
        'color': '#2A1810',
        'material': 'flatShading: true; shader: flat'
      }, fTree);

      var leafColors = ['#1F4020', '#2E5530', '#3F7040', '#264C28'];
      var nSph = 3 + Math.floor(rng(2));
      for (var s = 0; s < nSph; s++) {
        var ofx = rand(-0.8, 0.8);
        var ofz = rand(-0.8, 0.8);
        var ofy = 2.8 + rng(1.4);
        var dx = rand(-0.075, 0.075);
        mk('a-sphere', {
          'radius': 0.9 + rng(0.5),
          'segments-width': 6, 'segments-height': 4,
          'position': ofx + ' ' + ofy + ' ' + ofz,
          'color': leafColors[(fi + s) % 4],
          'material': 'flatShading: true; shader: flat',
          'animation': 'property: position; to: ' + (ofx + dx) + ' ' + ofy + ' ' + (ofz + dx) +
                       '; dur: ' + (3500 + rng(2500)) + '; dir: alternate; loop: true; easing: easeInOutSine'
        }, fTree);
      }
    }

    // ====================================================================
    // CAMADA 4: SILHUETAS DISTANTES (anel exterior, escuras)
    // ====================================================================
    for (var si = 0; si < d.silhouettes; si++) {
      var sang = (si / d.silhouettes) * Math.PI * 2 + rng(0.1);
      var sdist = 26 + rng(8);
      var sx = Math.cos(sang) * sdist;
      var sz = Math.sin(sang) * sdist;
      var sh = 5 + rng(3);
      mk('a-cone', {
        'radius-bottom': 1.2 + rng(0.6), 'radius-top': 0,
        'height': sh, 'segments-radial': 5,
        'position': sx + ' ' + (sh / 2) + ' ' + sz,
        'color': '#0F1E14',
        'material': 'shader: flat'
      });
    }

    // ====================================================================
    // SAMAMBAIAS (folhagem baixa em leque)
    // ====================================================================
    var placedFerns = [];
    for (var attempt = 0; attempt < 200 && placedFerns.length < d.ferns; attempt++) {
      var fang = rng(Math.PI * 2);
      var fdist = 2.5 + rng(8);
      var fx = Math.cos(fang) * fdist;
      var fz = Math.sin(fang) * fdist;
      if (distToClearing(fx, fz) < d.clearingR) continue;
      var okFern = true;
      for (var pf = 0; pf < placedFerns.length; pf++) {
        if (Math.sqrt(Math.pow(fx - placedFerns[pf].x, 2) + Math.pow(fz - placedFerns[pf].z, 2)) < 1.8) { okFern = false; break; }
      }
      if (!okFern) continue;
      placedFerns.push({ x: fx, z: fz });

      var fern = mk('a-entity', {
        'position': fx + ' 0 ' + fz,
        'rotation': '0 ' + rng(360) + ' 0'
      });
      for (var lf = 0; lf < 5; lf++) {
        var lang = (lf / 5) * Math.PI * 2;
        mk('a-cone', {
          'radius-bottom': 0.04, 'radius-top': 0.001,
          'height': 0.4 + rng(0.15), 'segments-radial': 3,
          'position': (Math.cos(lang) * 0.08) + ' 0.18 ' + (Math.sin(lang) * 0.08),
          'rotation': (60 + rng(20)) + ' 0 ' + (lang * (180 / Math.PI)),
          'color': Math.random() > 0.5 ? '#1F4020' : '#2E5530',
          'material': 'flatShading: true; shader: flat'
        }, fern);
      }
    }

    // ====================================================================
    // GRAMA (tufos de 3 cones cada)
    // ====================================================================
    var placedGrass = [];
    for (var attempt2 = 0; attempt2 < 200 && placedGrass.length < d.grass; attempt2++) {
      var gx = rand(-14, 14);
      var gz = rand(-14, 14);
      if (distToClearing(gx, gz) < 2.0) continue;
      if (Math.sqrt(gx * gx + gz * gz) < 1) continue;
      var okGrass = true;
      for (var pg = 0; pg < placedGrass.length; pg++) {
        if (Math.sqrt(Math.pow(gx - placedGrass[pg].x, 2) + Math.pow(gz - placedGrass[pg].z, 2)) < 1.5) { okGrass = false; break; }
      }
      if (!okGrass) continue;
      placedGrass.push({ x: gx, z: gz });

      var tuft = mk('a-entity', { 'position': gx + ' 0 ' + gz });
      for (var c = 0; c < 3; c++) {
        var cox = rand(-0.1, 0.1);
        var coz = rand(-0.1, 0.1);
        var ch = 0.25 + rng(0.25);
        mk('a-cone', {
          'radius-bottom': 0.06, 'radius-top': 0.001,
          'height': ch, 'segments-radial': 3,
          'position': cox + ' ' + (ch / 2) + ' ' + coz,
          'color': Math.random() > 0.5 ? '#2A4F2A' : '#3D5F1F',
          'material': 'flatShading: true; shader: flat'
        }, tuft);
      }
    }

    // ====================================================================
    // FLORES SILVESTRES (caule verde + cabeça colorida emissiva)
    // ====================================================================
    var flowerColors = ['#E8C56B', '#D4A82C', '#FFF8DC', '#C8A4FF', '#A85AB8'];
    for (var fl = 0; fl < d.flowers; fl++) {
      var flang = rng(Math.PI * 2);
      var fldist = 3 + rng(9);
      var flx = Math.cos(flang) * fldist;
      var flz = Math.sin(flang) * fldist;
      if (distToClearing(flx, flz) < d.clearingR) continue;

      var flower = mk('a-entity', { 'position': flx + ' 0 ' + flz });
      mk('a-cylinder', {
        'radius': 0.012, 'height': 0.2, 'segments-radial': 3,
        'position': '0 0.1 0',
        'color': '#2E5530',
        'material': 'shader: flat'
      }, flower);
      var fcol = flowerColors[fl % flowerColors.length];
      mk('a-sphere', {
        'radius': 0.035,
        'segments-width': 4, 'segments-height': 3,
        'position': '0 0.22 0',
        'color': fcol,
        'material': 'emissive: ' + fcol + '; emissiveIntensity: 0.4; shader: flat'
      }, flower);
    }

    // ====================================================================
    // COGUMELOS MÁGICOS (caule bege + chapéu rosa + pintinhas brancas)
    // ====================================================================
    var mushroomSpots = [
      { x: -1.8, z: -3.2 }, { x: 1.5, z: -2.5 }, { x: -3.5, z: -5 },
      { x: 2.8, z: -6 }, { x: -2, z: -7 }, { x: 4, z: -3 },
      { x: -5, z: -8 }, { x: 3, z: -9 }
    ];
    for (var mi = 0; mi < Math.min(d.mushrooms, mushroomSpots.length); mi++) {
      var ms = mushroomSpots[mi];
      var mushroom = mk('a-entity', { 'position': ms.x + ' 0 ' + ms.z });
      mk('a-cylinder', {
        'radius': 0.04, 'height': 0.15, 'segments-radial': 5,
        'position': '0 0.075 0',
        'color': '#E8D5B0',
        'material': 'flatShading: true; shader: flat'
      }, mushroom);
      mk('a-sphere', {
        'radius': 0.1,
        'segments-width': 6, 'segments-height': 4,
        'position': '0 0.18 0',
        'scale': '1 0.6 1',
        'color': '#A8345E',
        'material': 'emissive: #A8345E; emissiveIntensity: 0.3; flatShading: true; shader: flat'
      }, mushroom);
      for (var dd = 0; dd < 3; dd++) {
        var dang = (dd / 3) * Math.PI * 2;
        mk('a-sphere', {
          'radius': 0.018,
          'position': (Math.cos(dang) * 0.06) + ' 0.21 ' + (Math.sin(dang) * 0.06),
          'color': '#FFF8DC',
          'material': 'shader: flat'
        }, mushroom);
      }
    }

    // ====================================================================
    // PEDRAS/ROCHEDOS espalhados
    // ====================================================================
    for (var rk = 0; rk < d.rocks; rk++) {
      var rkang = rng(Math.PI * 2);
      var rkdist = 4 + rng(10);
      var rkx = Math.cos(rkang) * rkdist;
      var rkz = Math.sin(rkang) * rkdist;
      if (distToClearing(rkx, rkz) < d.clearingR) continue;

      var rs = 0.2 + rng(0.35);
      mk('a-sphere', {
        'radius': rs,
        'segments-width': 5, 'segments-height': 4,
        'position': rkx + ' ' + (rs * 0.5) + ' ' + rkz,
        'scale': '1 0.6 1.1',
        'rotation': '0 ' + rng(360) + ' 0',
        'color': Math.random() > 0.5 ? '#2a2a35' : '#1f1f28',
        'material': 'flatShading: true; shader: flat'
      });
    }

    // ====================================================================
    // TRONCOS CAÍDOS (com cogumelinhos laranja crescendo)
    // ====================================================================
    var logPos = [
      { x: -5, z: -3, rot: 65 },
      { x: 4.5, z: 4, rot: 120 },
      { x: -8, z: 6, rot: 30 }
    ];
    for (var lg = 0; lg < Math.min(d.logs, logPos.length); lg++) {
      var lp = logPos[lg];
      var log = mk('a-entity', {
        'position': lp.x + ' 0.18 ' + lp.z,
        'rotation': '0 ' + lp.rot + ' 90'
      });
      mk('a-cylinder', {
        'radius': 0.25, 'height': 1.8, 'segments-radial': 7,
        'color': '#3A2818',
        'material': 'flatShading: true; shader: flat'
      }, log);
      [-0.9, 0.9].forEach(function (yy) {
        mk('a-circle', {
          'radius': 0.25,
          'position': '0 ' + yy + ' 0',
          'rotation': '90 0 0',
          'color': '#5C3A1A',
          'material': 'shader: flat'
        }, log);
      });
      for (var mm = 0; mm < 3; mm++) {
        mk('a-sphere', {
          'radius': 0.05,
          'segments-width': 4, 'segments-height': 3,
          'position': rand(-0.7, 0.7) + ' 0.25 ' + rand(-0.2, 0.2),
          'color': '#E8945C',
          'material': 'emissive: #E8945C; emissiveIntensity: 0.3; shader: flat'
        }, log);
      }
    }

    // ====================================================================
    // MANCHAS DE CHÃO (variação sutil de cor — textura visual)
    // ====================================================================
    for (var pt = 0; pt < d.patches; pt++) {
      var ptang = rng(Math.PI * 2);
      var ptdist = 3 + rng(10);
      var ptx = Math.cos(ptang) * ptdist;
      var ptz = Math.sin(ptang) * ptdist;
      mk('a-circle', {
        'radius': 1 + rng(2.5),
        'position': ptx + ' 0.008 ' + ptz,
        'rotation': '-90 ' + rng(360) + ' 0',
        'color': Math.random() > 0.5 ? '#1E2818' : '#10180e',
        'material': 'shader: flat'
      });
    }

    // ====================================================================
    // VAGA-LUMES (flutuantes, com brilho e movimento independente)
    // ====================================================================
    for (var vl = 0; vl < d.fireflies; vl++) {
      var vx = rand(-9, 9);
      var vy = 0.6 + rng(2.8);
      var vz = rand(-9, 9);
      // Mantém distância da clareira (mas pode estar próximo, é luzinha)
      if (Math.abs(vx - d.clearingX) < 1.5 && Math.abs(vz - d.clearingZ) < 1.5) {
        vx += vx < 0 ? -2 : 2;
      }
      var dy = 0.5 + rng(0.9);
      var dvx = rand(-0.5, 0.5);
      mk('a-sphere', {
        'radius': 0.05,
        'segments-width': 4, 'segments-height': 3,
        'position': vx + ' ' + vy + ' ' + vz,
        'color': '#FFEA80',
        'material': 'emissive: #FFEA80; emissiveIntensity: 1.5; shader: flat',
        'animation__y': 'property: position; to: ' + (vx + dvx) + ' ' + (vy + dy) + ' ' + vz +
                        '; dur: ' + (2400 + rng(2400)) + '; dir: alternate; loop: true; easing: easeInOutSine',
        'animation__o': 'property: material.opacity; from: 0.2; to: 1; dur: ' + (600 + rng(1400)) + '; dir: alternate; loop: true'
      });
    }
  }
});
