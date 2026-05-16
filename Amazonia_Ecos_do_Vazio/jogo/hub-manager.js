/**
 * hub-manager — Orquestra a cena do hub.
 * - Carrega progresso do localStorage
 * - Bloqueia/desbloqueia portais conforme arenas concluídas
 * - Trata transição para arenas
 * - Exibe mensagens narrativas curtas (toast)
 */
AFRAME.registerComponent('hub-manager', {
  init() {
    this.progress = this._loadProgress();
    this._applyLocks();

    this.el.sceneEl.addEventListener('portal-activate', (e) => {
      const dest = e.detail.destination;
      this._transitionTo(dest);
    });
    this.el.sceneEl.addEventListener('hub-message', (e) => {
      this._showToast(e.detail.text);
    });
  },

  _loadProgress() {
    try {
      const raw = localStorage.getItem('amazonia_progress');
      return raw ? JSON.parse(raw) : {
        mataViva: false, rioEsquecido: false, florestaCinzas: false,
        florestaQuebrada: false, vazio: false
      };
    } catch (e) {
      return {};
    }
  },

  _applyLocks() {
    // Progressão linear: cada arena exige a anterior
    const order = ['mata-viva', 'rio-esquecido', 'floresta-cinzas', 'floresta-quebrada', 'vazio'];
    const keys  = ['mataViva',  'rioEsquecido', 'florestaCinzas', 'florestaQuebrada', 'vazio'];

    document.querySelectorAll('[portal]').forEach((p) => {
      const dest = p.getAttribute('portal').destination;
      const idx = order.indexOf(dest);
      if (idx <= 0) return; // primeira sempre liberada
      const prevKey = keys[idx - 1];
      const locked = !this.progress[prevKey];
      p.setAttribute('portal', 'locked', locked);
    });
  },

  _transitionTo(dest) {
    const fade = document.querySelector('#fade-overlay');
    if (fade) {
      fade.setAttribute('animation', 'property: material.opacity; to: 1; dur: 800');
    }
    setTimeout(() => {
      // Em produção, navega para arena específica.
      // Por enquanto, simula com mensagem.
      window.location.href = `arenas/${dest}.html`;
    }, 850);
  },

  _showToast(text) {
    const toast = document.querySelector('#toast');
    if (!toast) return;
    toast.setAttribute('value', text);
    toast.setAttribute('visible', true);
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.setAttribute('visible', false), 3000);
  }
});
