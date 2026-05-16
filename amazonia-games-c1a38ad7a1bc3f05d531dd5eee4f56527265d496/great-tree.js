/* ============================================================================
   GREAT-TREE.JS — A ÁRVORE GIGANTE DO CORAÇÃO DA MATA
   ============================================================================

   O QUE FAZ:
   Constrói a árvore espiritual gigantesca que fica no centro do hub.
   Ela tem raízes salientes, tronco grosso, copa em 3 camadas que "respiram"
   (pulsam) e uma luz mística no topo.

   POR QUE EXISTE:
   Na história, esta árvore é o "coração" da Amazônia. Todas as 5 regiões
   se conectam a ela. Enquanto ela existe, a floresta espiritual existe.

   COMO É CONSTRUÍDA (montagem por peças):
   - 6 raízes (cones inclinados ao redor da base)
   - 1 tronco (cilindro grosso)
   - 3 camadas de folhagem (esferas verdes em alturas diferentes)
   - 1 luz pontual no topo (aura mágica)
   ============================================================================ */

AFRAME.registerComponent('great-tree', {

  init: function () {
    var el = this.el;        // referência ao objeto na cena
    var i, angle, x, z;      // variáveis auxiliares de cálculo

    // ===== PEÇA 1: AS 6 RAÍZES AO REDOR DA BASE =====
    // Distribui 6 cones em círculo, todos inclinados para fora
    for (i = 0; i < 6; i++) {
      angle = (i / 6) * Math.PI * 2;  // posição angular (em radianos)

      var root = document.createElement('a-cone');
      root.setAttribute('radius-bottom', 0.25);  // base do cone (mais larga)
      root.setAttribute('radius-top', 0.05);     // topo do cone (afunilado)
      root.setAttribute('height', 1.5);
      root.setAttribute('segments-radial', 5);   // só 5 lados (low-poly)
      root.setAttribute('color', '#3E2723');     // marrom bem escuro

      // Calcula posição em círculo ao redor do tronco
      x = Math.cos(angle) * 1.5;  // distância horizontal
      z = Math.sin(angle) * 1.5;  // distância em profundidade
      root.setAttribute('position', x + ' 0.3 ' + z);

      // Inclina a raiz para fora (parecer saindo do chão)
      root.setAttribute('rotation',
        (-Math.sin(angle) * 45) + ' ' +
        (-angle * 180 / Math.PI) + ' ' +
        (Math.cos(angle) * 45)
      );

      el.appendChild(root);
    }

    // ===== PEÇA 2: O TRONCO PRINCIPAL =====
    var trunk = document.createElement('a-cylinder');
    trunk.setAttribute('radius', 1.2);          // 1,2m de raio (bem grosso)
    trunk.setAttribute('height', 8);            // 8m de altura
    trunk.setAttribute('segments-radial', 8);   // 8 lados
    trunk.setAttribute('position', '0 4 0');    // centro a 4m do chão
    trunk.setAttribute('color', '#5D4037');     // marrom de tronco
    trunk.setAttribute('material', 'roughness: 0.95');  // bem fosco (sem brilho)
    el.appendChild(trunk);

    // ===== PEÇA 3: AS 3 CAMADAS DE COPA (folhagem que "respira") =====
    // Cada camada é uma esfera verde em altura/tamanho diferente
    var layers = [
      { y: 9,    r: 4.5, color: '#2E5D31', dur: 4000 },  // base da copa (verde escuro, ciclo de 4s)
      { y: 11,   r: 3.8, color: '#3F7042', dur: 4500 },  // meio (verde médio, ciclo de 4.5s)
      { y: 12.5, r: 2.5, color: '#52A256', dur: 5000 }   // topo (verde claro, ciclo de 5s)
    ];

    layers.forEach(function (l) {
      var leaves = document.createElement('a-sphere');
      leaves.setAttribute('radius', l.r);
      leaves.setAttribute('segments-width', 10);   // poucas divisões (low-poly)
      leaves.setAttribute('segments-height', 6);
      leaves.setAttribute('position', '0 ' + l.y + ' 0');
      leaves.setAttribute('color', l.color);
      leaves.setAttribute('material', 'roughness: 0.9; flatShading: true');

      // Animação de "respiração" — escala oscila entre 100% e 104%
      // (faz a árvore parecer viva, respirando)
      leaves.setAttribute('animation__breath', {
        property: 'scale',
        from: '1 1 1',
        to: '1.04 1.04 1.04',
        dir: 'alternate',     // vai e volta
        loop: true,           // pra sempre
        dur: l.dur,           // duração de cada ciclo
        easing: 'easeInOutSine'  // suavidade
      });

      el.appendChild(leaves);
    });

    // ===== PEÇA 4: LUZ ESPIRITUAL NO TOPO =====
    // Uma luz verde clara emanando da copa (aura mística)
    var aura = document.createElement('a-light');
    aura.setAttribute('type', 'point');        // ilumina em todas as direções
    aura.setAttribute('color', '#A8E6CF');     // verde-menta claro
    aura.setAttribute('intensity', 0.8);
    aura.setAttribute('distance', 20);         // alcance de 20m
    aura.setAttribute('position', '0 11 0');   // na altura da copa
    el.appendChild(aura);

    // ===== PEÇA 5: ESPÍRITOS ORBITANDO A ÁRVORE =====
    // 4 esferinhas brilhantes que giram em torno do tronco
    for (i = 0; i < 4; i++) {
      var dir = (i % 2 === 0) ? 360 : -360;  // metade gira pra um lado, metade pro outro
      var dur = 6000 + i * 800;              // cada um numa velocidade diferente
      var yLevel = 5 + i * 1.5;              // alturas escalonadas

      // O "wrapper" é o eixo de rotação (gira em torno do centro)
      var wrapper = document.createElement('a-entity');
      wrapper.setAttribute('position', '0 ' + yLevel + ' 0');
      wrapper.setAttribute('animation',
        'property: rotation; to: 0 ' + dir + ' 0; loop: true; dur: ' + dur + '; easing: linear');

      // O espírito em si (esfera brilhante)
      var spirit = document.createElement('a-sphere');
      spirit.setAttribute('radius', 0.12);
      spirit.setAttribute('color', '#B0E0E6');
      spirit.setAttribute('material', 'emissive: #B0E0E6; emissiveIntensity: 1; shader: flat');
      spirit.setAttribute('position', (2 + i * 0.4) + ' 0 0');  // distância do centro

      wrapper.appendChild(spirit);
      el.appendChild(wrapper);
    }
  }
});
