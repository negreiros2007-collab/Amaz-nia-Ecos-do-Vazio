/* ============================================================================
   DENSE-FOREST.JS — APENAS ÁRVORES ADICIONAIS (versão leve e segura)
   ============================================================================
   Adiciona 40 árvores em um anel intermediário, sem mexer em mais nada.
   - Sem partículas, sem vagalumes, sem plantas, sem animações pesadas
   - Apenas cilindros (tronco) + esferas (copa) — primitivas simples
   - Total ~80 polígonos por árvore = ~3200 polígonos no total (bem leve)
   ============================================================================ */
AFRAME.registerComponent('dense-forest', {
  schema: {
    count:     { type: 'number', default: 40 },
    minRadius: { type: 'number', default: 10 },
    maxRadius: { type: 'number', default: 16 }
  },

  init: function () {
    var el = this.el;
    var n = this.data.count;
    var minR = this.data.minRadius;
    var maxR = this.data.maxRadius;

    for (var i = 0; i < n; i++) {
      var ang = (i / n) * Math.PI * 2 + (Math.random() * 0.2);
      var dist = minR + Math.random() * (maxR - minR);
      var x = Math.cos(ang) * dist;
      var z = Math.sin(ang) * dist;
      var h = 4 + Math.random() * 3;

      // Tronco (cilindro marrom escuro)
      var trunk = document.createElement('a-cylinder');
      trunk.setAttribute('radius', 0.25);
      trunk.setAttribute('height', h);
      trunk.setAttribute('segments-radial', 5);
      trunk.setAttribute('position', x + ' ' + (h / 2) + ' ' + z);
      trunk.setAttribute('color', '#3E2723');
      el.appendChild(trunk);

      // Copa (esfera verde — sem flat-shading nem material extra)
      var crown = document.createElement('a-sphere');
      crown.setAttribute('radius', 1.4 + Math.random() * 0.4);
      crown.setAttribute('segments-width', 6);
      crown.setAttribute('segments-height', 4);
      crown.setAttribute('position', x + ' ' + (h + 0.7) + ' ' + z);
      var shades = ['#1F4020','#2E5D31','#3F7042','#264C28'];
      crown.setAttribute('color', shades[i % 4]);
      el.appendChild(crown);
    }
  }
});
