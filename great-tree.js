/**
 * great-tree — Árvore espiritual gigante do Coração da Mata.
 */
AFRAME.registerComponent('great-tree', {
  init: function () {
    var el = this.el;
    var i, angle, x, z;

    for (i = 0; i < 6; i++) {
      angle = (i / 6) * Math.PI * 2;
      var root = document.createElement('a-cone');
      root.setAttribute('radius-bottom', 0.25);
      root.setAttribute('radius-top', 0.05);
      root.setAttribute('height', 1.5);
      root.setAttribute('segments-radial', 5);
      root.setAttribute('color', '#3E2723');
      x = Math.cos(angle) * 1.5;
      z = Math.sin(angle) * 1.5;
      root.setAttribute('position', x + ' 0.3 ' + z);
      root.setAttribute('rotation', (-Math.sin(angle) * 45) + ' ' + (-angle * 180 / Math.PI) + ' ' + (Math.cos(angle) * 45));
      el.appendChild(root);
    }

    var trunk = document.createElement('a-cylinder');
    trunk.setAttribute('radius', 1.2);
    trunk.setAttribute('height', 8);
    trunk.setAttribute('segments-radial', 8);
    trunk.setAttribute('position', '0 4 0');
    trunk.setAttribute('color', '#5D4037');
    trunk.setAttribute('material', 'roughness: 0.95');
    el.appendChild(trunk);

    var layers = [
      { y: 9,    r: 4.5, color: '#2E5D31', dur: 4000 },
      { y: 11,   r: 3.8, color: '#3F7042', dur: 4500 },
      { y: 12.5, r: 2.5, color: '#52A256', dur: 5000 }
    ];
    layers.forEach(function (l) {
      var leaves = document.createElement('a-sphere');
      leaves.setAttribute('radius', l.r);
      leaves.setAttribute('segments-width', 10);
      leaves.setAttribute('segments-height', 6);
      leaves.setAttribute('position', '0 ' + l.y + ' 0');
      leaves.setAttribute('color', l.color);
      leaves.setAttribute('material', 'roughness: 0.9; flatShading: true');
      leaves.setAttribute('animation__breath', {
        property: 'scale', from: '1 1 1', to: '1.04 1.04 1.04',
        dir: 'alternate', loop: true, dur: l.dur, easing: 'easeInOutSine'
      });
      el.appendChild(leaves);
    });

    var aura = document.createElement('a-light');
    aura.setAttribute('type', 'point');
    aura.setAttribute('color', '#A8E6CF');
    aura.setAttribute('intensity', 0.8);
    aura.setAttribute('distance', 20);
    aura.setAttribute('position', '0 11 0');
    el.appendChild(aura);

    for (i = 0; i < 4; i++) {
      var dir = (i % 2 === 0) ? 360 : -360;
      var dur = 6000 + i * 800;
      var yLevel = 5 + i * 1.5;

      var wrapper = document.createElement('a-entity');
      wrapper.setAttribute('position', '0 ' + yLevel + ' 0');
      wrapper.setAttribute('animation', 'property: rotation; to: 0 ' + dir + ' 0; loop: true; dur: ' + dur + '; easing: linear');

      var spirit = document.createElement('a-sphere');
      spirit.setAttribute('radius', 0.12);
      spirit.setAttribute('color', '#B0E0E6');
      spirit.setAttribute('material', 'emissive: #B0E0E6; emissiveIntensity: 1; shader: flat');
      spirit.setAttribute('position', (2 + i * 0.4) + ' 0 0');

      wrapper.appendChild(spirit);
      el.appendChild(wrapper);
    }
  }
});
