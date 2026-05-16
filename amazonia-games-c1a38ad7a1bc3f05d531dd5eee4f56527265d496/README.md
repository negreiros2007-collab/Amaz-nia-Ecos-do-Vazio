# Amazônia: Ecos do Vazio

Jogo VR para Google Cardboard (mobile) — folclore amazônico em realidade virtual.

## Status

**Dia 1 do cronograma — entregue:**

- Estrutura do projeto
- Componentes A-Frame core: `gaze-cursor`, `totem`, `portal`, `paje`, `great-tree`, `hub-manager`
- Hub Central (Coração da Mata) jogável
- 5 portais visíveis (Mata Viva liberado, demais bloqueados)
- Sistema de gaze + clique do Cardboard
- HUD: barra de energia do totem
- TTS para narração do Pajé

## Como rodar

### Modo desktop (preview)
1. Abra `index.html` em um navegador moderno (Chrome/Edge/Firefox).
2. Para evitar problemas de CORS com módulos, sirva via servidor local:
   ```bash
   cd AmazoniaVR
   python3 -m http.server 8000
   ```
3. Acesse http://localhost:8000

### Modo VR (Google Cardboard)
1. Hospede a pasta em HTTPS (GitHub Pages, Netlify, Vercel — WebXR exige HTTPS).
2. Abra a URL no Chrome do Android.
3. Clique no ícone de óculos VR no canto inferior direito.
4. Encaixe o celular no Cardboard.

## Controles

| Ação | Desktop | Mobile/Cardboard |
|------|---------|------------------|
| Olhar | Arrastar mouse | Mover a cabeça |
| Mira | Cursor central (gaze) | Cursor central (gaze) |
| Ativar (portal/diálogo) | Olhar 2s | Olhar 2s |
| Disparar totem | Segurar Espaço ou clique | Segurar botão Cardboard |

## Estrutura

```
AmazoniaVR/
├── index.html            # Hub Central (Coração da Mata)
├── arenas/
│   ├── mata-viva.html    # Arena 1 (dia 4)
│   ├── rio-esquecido.html (dia 5)
│   ├── floresta-cinzas.html (dia 6)
│   ├── floresta-quebrada.html (dia 7)
│   └── vazio.html (dia 8)
├── js/components/
│   ├── gaze-cursor.js    # Sistema de mira/gaze
│   ├── totem.js          # Totem da Floresta + feixe de luz
│   ├── portal.js         # Portais espirituais
│   ├── great-tree.js     # Árvore central do hub
│   ├── paje.js           # Pajé Esquecido (NPC narrativo)
│   └── hub-manager.js    # Orquestrador do hub + progresso
└── assets/               # (sons, modelos opcionais)
```

## Próximos passos (cronograma)

- **Dia 2:** Hub central polido — terminado parcialmente
- **Dia 3:** Sistema de combate do totem + dano
- **Dia 4:** Arena Mata Viva + Curupira
- **Dia 5:** Arena Rio Esquecido + Iara
- **Dia 6:** Arena Floresta em Cinzas + Boitatá
- **Dia 7:** Arena Floresta Quebrada + Mapinguari
- **Dia 8:** Boto-cor-de-rosa + Arena O Vazio
- **Dia 9:** Narração, áudio, finais
- **Dia 10:** Polimento e testes finais
