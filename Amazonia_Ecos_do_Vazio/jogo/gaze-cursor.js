/* ============================================================================
   GAZE-CURSOR.JS — A MIRA DO JOGADOR (controle por olhar)
   ============================================================================

   O QUE FAZ:
   Cria a "mirinha" branca no centro da visão do jogador. Quando o jogador
   olha fixamente para um objeto interativo por 2 segundos, ele "clica"
   nesse objeto automaticamente. É como apontar com os olhos.

   POR QUE EXISTE:
   No Google Cardboard você não tem mouse, teclado ou controle.
   Só o que dá pra fazer é mexer a cabeça. Então a forma de "selecionar"
   coisas é olhando fixamente pra elas.

   COMO FUNCIONA:
   1. Desenha um anel branco no centro da tela
   2. Lança um raio invisível para frente (na direção que o jogador olha)
   3. Quando o raio bate em um objeto interativo, começa um cronômetro
   4. Um anel dourado vai se preenchendo ao redor da mira (mostrando progresso)
   5. Quando o anel completa (2 segundos), o objeto é "clicado"
   ============================================================================ */

AFRAME.registerComponent('gaze-cursor', {

  // -----------------------------------------------------------------
  // CONFIGURAÇÕES que você pode ajustar:
  // -----------------------------------------------------------------
  schema: {
    fuseTimeout: { type: 'number', default: 2000 },  // tempo em milissegundos para "clicar" olhando (2000 = 2 segundos)
    color:       { type: 'color',  default: '#FFFFFF' },  // cor do anel da mira (branco)
    activeColor: { type: 'color',  default: '#FFD700' }   // cor do anel de progresso (dourado)
  },

  // -----------------------------------------------------------------
  // init() — chamado UMA VEZ quando o componente é criado
  // -----------------------------------------------------------------
  init: function() {
    var el = this.el;        // "el" é o objeto na cena (a mira em si)
    this.fuseStart = null;   // quando começou a fixação no objeto (null = ninguém)
    this.target = null;      // qual objeto está sendo olhado no momento

    // PASSO 1: Cria o anel branco da mira (uma rosquinha 2D)
    el.setAttribute('geometry', 'primitive: ring; radiusInner: 0.012; radiusOuter: 0.02');
    el.setAttribute('material', 'color: ' + this.data.color + '; shader: flat; opacity: 0.9; transparent: true');
    el.setAttribute('position', '0 0 -0.6');  // 60cm na frente da câmera

    // PASSO 2: Cria o "lançador de raio" invisível
    // (procura objetos com a classe CSS "gaze-target" até 50 metros à frente)
    el.setAttribute('raycaster', 'objects: .gaze-target; far: 50');

    // PASSO 3: Cria o anel dourado de progresso (começa invisível, com 0 graus)
    var ring = document.createElement('a-entity');
    ring.setAttribute('geometry', 'primitive: ring; radiusInner: 0.014; radiusOuter: 0.018; thetaLength: 0');
    ring.setAttribute('material', 'color: ' + this.data.activeColor + '; shader: flat; side: double');
    ring.setAttribute('rotation', '0 0 90');
    el.appendChild(ring);
    this.progressRing = ring;

    // PASSO 4: Escuta os eventos do "raio"
    var self = this;

    // Quando o raio bate em algo
    el.addEventListener('raycaster-intersection', function(e) {
      var hit = e.detail.els[0];  // o objeto atingido
      if (!hit || !hit.classList.contains('gaze-target')) return;  // ignora se não é interativo
      self.target = hit;
      self.fuseStart = performance.now();  // marca o tempo atual
      hit.emit('gaze-enter');  // avisa o objeto: "estou olhando pra você"
    });

    // Quando o raio sai do objeto
    el.addEventListener('raycaster-intersection-cleared', function() {
      if (self.target) {
        self.target.emit('gaze-leave');  // avisa o objeto: "parei de olhar"
        self.target = null;
      }
      self.fuseStart = null;
      self.progressRing.setAttribute('geometry', 'thetaLength', 0);  // zera o anel dourado
    });
  },

  // -----------------------------------------------------------------
  // tick() — roda 60 vezes por segundo
  // (verifica se já passou tempo suficiente olhando pro objeto)
  // -----------------------------------------------------------------
  tick: function() {
    if (!this.target || !this.fuseStart) return;  // nenhum objeto sendo olhado

    // Calcula quanto tempo passou desde que começou a olhar
    var elapsed = performance.now() - this.fuseStart;
    var progress = Math.min(elapsed / this.data.fuseTimeout, 1);  // 0 a 1 (0% a 100%)

    // Atualiza o anel dourado (preenche conforme o tempo passa)
    this.progressRing.setAttribute('geometry', 'thetaLength', progress * 360);
    this.target.emit('gaze-progress', { progress: progress });

    // Se completou 100%, "clica" no objeto
    if (progress >= 1) {
      this.target.emit('gaze-fire');   // evento customizado
      this.target.emit('click');       // simula um clique normal
      this.fuseStart = performance.now() + 99999;  // trava (não dispara de novo)
    }
  }
});


/* ============================================================================
   GAZE-TARGET — marca um objeto como "alvo da mira"
   ============================================================================
   Use este componente em qualquer objeto que deve reagir ao olhar do jogador.
   Ele faz o objeto crescer levemente quando o jogador olha pra ele.
   ============================================================================ */
AFRAME.registerComponent('gaze-target', {
  schema: {
    hoverScale: { type: 'number', default: 1.15 }  // o quanto cresce ao ser olhado (15%)
  },

  init: function() {
    var el = this.el;
    el.classList.add('gaze-target');  // marca como interativo

    // Quando o jogador começa a olhar → cresce
    el.addEventListener('gaze-enter', function() {
      el.setAttribute('animation__hover', 'property: scale; to: 1.1 1.1 1.1; dur: 200');
    });

    // Quando para de olhar → volta ao tamanho normal
    el.addEventListener('gaze-leave', function() {
      el.setAttribute('animation__hover', 'property: scale; to: 1 1 1; dur: 200');
    });
  }
});
