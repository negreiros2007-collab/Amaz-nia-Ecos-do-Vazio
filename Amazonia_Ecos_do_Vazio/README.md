# Amazônia: Ecos do Vazio

Projeto de jogo VR Cardboard mobile baseado no folclore amazônico brasileiro.

## Estrutura

```
Amazonia_Ecos_do_Vazio/
├── jogo/                    ← Arquivos do jogo (subir aqui pro GitHub Pages)
│   ├── index.html           ← Página principal do jogo
│   ├── *.js                 ← Componentes A-Frame (cuca, totem, portais, etc.)
│   └── README.md            ← Documentação técnica do jogo
│
├── documentos/              ← Documentação do projeto
│   ├── GDD_completo.pdf     ← Game Design Document (profissional)
│   ├── Relatorio_MVP.pdf    ← Análise técnica e requisitos do MVP
│   ├── conceito_original.txt← Conceito inicial do jogo (entrada do brief)
│   ├── ANALISE-PROFUNDA.md  ← Notas de análise
│   └── documentacao_projeto.txt
│
└── assets_antigos/          ← Versão antiga do projeto (referência)
    ├── *.html               ← HTMLs de personagens da versão inicial
    ├── *.png                ← Imagens dos personagens (Saci, Iara, Boitatá)
    └── *.mp3                ← Trilha de áudio antiga
```

## Como rodar o jogo

### Online (GitHub Pages — recomendado)
Acesse: https://paulometon.github.io/amazonia-games/

### Localmente
```bash
cd jogo
python -m http.server 8000
```
Depois abra http://localhost:8000 no Chrome.

### No Cardboard (mobile)
1. Abra a URL no Chrome do Android
2. Toque em "ENTRAR NO MUNDO DAS LENDAS"
3. Toque no botão VR (canto superior direito)
4. Encaixe o celular no Google Cardboard

## Controles

- **Olhar:** mover a cabeça
- **Andar:** olhar pra baixo (>25°) anda na direção horizontal
- **Parar:** olhar pra frente ou cima
- **Purificar:** olhar fixo numa mancha de Vazio — o totem dispara automaticamente
- **PC (preview):** WASD pra andar, espaço pra disparar totem

## Stack técnica

- A-Frame 1.5 (WebVR/WebXR)
- Three.js (renderização 3D)
- HTML5 + JavaScript ES5+
- Hospedado no GitHub Pages (HTTPS)

## Status

Versão MVP em desenvolvimento — Hub Central + sistemas core funcionais.
Próximo passo: Arena Mata Viva + chefe Curupira.
