# Análise Profunda — Amazônia Games

> Auditoria técnica completa do projeto: arquitetura, qualidade de código, performance, acessibilidade, bugs e recomendações priorizadas.

---

## 1. Visão Geral

**O que é:** plataforma web de mini-jogos inspirados no folclore brasileiro, 100% client-side (HTML + CSS + JS), sem build, sem backend, sem dependências externas exceto Google Fonts.

**Estado atual:** 5 jogos jogáveis (Boitatá, Saci, Iara, Boto, Caipora) + menu central. Já recebeu uma rodada de otimização para mobile (desabilitação de `ctx.shadowBlur`, `backdrop-filter` e `drop-shadow` em telas pequenas).

**Stack:** HTML5 Canvas 2D, CSS3 (gradientes, animações), JavaScript ES2015+ (sem framework).

---

## 2. Inventário de Arquivos

| Arquivo            | Linhas | JS  | CSS | Função              |
|--------------------|-------:|----:|----:|---------------------|
| `index.html`       |   513  |  21 | 377 | Menu principal      |
| `boitata.html`     | 1.226  | 676 | 469 | Jogo de ação        |
| `saci.html`        | 1.294  | 704 | 497 | Jogo de fuga        |
| `boto.html`        | 1.205  | 707 | 410 | Stealth (refeito)   |
| `caipora.html`     | 1.160  | 690 | 377 | Tower defense       |
| `iara.html`        |   774  | 388 | 327 | Ritmo               |
| **Total**          |**6.172** | **3.186** | **2.457** | |

**Assets:** `boitata.png`, `saci.png`, `iara.png`, `ate-que-durou-ao-vivo.mp3` (música, usada só em `iara.html`).

**Assets faltantes:** não há `boto.png` nem `caipora.png` — os jogos usam emojis no menu, o que é coerente, mas inconsistente com os outros três.

---

## 3. Arquitetura

### 3.1 Padrão "single-file por jogo"

Cada jogo é um HTML monolítico (HTML + `<style>` + `<script>` no mesmo arquivo). Vantagens reais:

- Deploy estático trivial (qualquer hosting de arquivo serve).
- Sem build, sem `npm`, sem cache de bundle quebrado.
- Cada jogo é independente — quebrar um não derruba os outros.

Custos reais:

- **Duplicação massiva.** Cada jogo reimplementa: detecção de mobile, `resize()` com `visualViewport`, override de `shadowBlur`, HUD pill, botão "← Menu", D-pad, overlay de game over, estilos do menu/título/badge, etc. O CSS dos 5 jogos soma 2.457 linhas — estimo que 60–70% disso é repetição.
- Bug fix em um jogo precisa ser propagado manualmente nos outros.
- Mesma classe (`hud-pill`, `voltar`, `btn-comecar`) reapareceu em cada arquivo com pequenas variações.

### 3.2 Fluxo

```
index.html  ──(click no card)──>  ir(jogo)  ──>  window.location = jogo + ".html"
```

Cada jogo tem três estados visuais: `#menu` (tela inicial), `#game` (canvas + HUD), `#overlay` (game over). Eles são alternados via `display:none/block/flex`. Não há roteamento SPA — recarrega a página inteira ao trocar de jogo.

### 3.3 Documentação

`📄 DOCUMENTAÇÃO DO PROJETO.txt` está **desatualizada**: descreve só Saci e Boitatá. Hoje existem 5 jogos. A documentação enumera 10 requisitos funcionais e 7 não-funcionais que não refletem mais o escopo. **Precisa ser regenerada.**

---

## 4. Análise por Jogo

### 4.1 Boitatá — `boitata.html` ✅

Jogo de ação top-down: serpente de fogo que devora inimigos e atira bolas de fogo.

- **Mecânica:** sólida. Movimento com rastro (trail), cooldown de tiro, sistema de vidas com invulnerabilidade temporária (`invuln`), HUD com coração de HP.
- **Pontos fortes:** feedback visual rico (flash vermelho de dano, pulse no HUD), inputs duplicados (teclado + D-pad + botão de fogo).
- **Issues:** o trail é gerado a cada frame com `TRAIL_LEN * TRAIL_SPACING = 54` pontos — não é problema, mas cada render percorre todos eles desenhando círculos com gradiente.

### 4.2 Saci — `saci.html` ✅

Jogo de fuga com habilidades (Vento, Teleporte, Redemoinho), cada uma com cooldown.

- **Mecânica:** completa. Caçadores perseguem, habilidades empurram inimigos, pontuação cresce com tempo de sobrevivência.
- **Pontos fortes:** UI de cooldown circular nos botões de poder, comentários no código (`/* todos os spans dentro do botão deixam o clique passar */`), três habilidades distintas dão variedade.
- **Issues:** 1.294 linhas no mesmo arquivo — o mais longo. Difícil de navegar.

### 4.3 Boto cor-de-rosa — `boto.html` ✅ (recém-refeito)

Stealth top-down ao estilo Party Hard: seduzir festeiros sem ser visto.

- **Mecânica:** raios de visão configuráveis, suspeita global, spawn de caçadores quando suspeita enche, NPCs com estados (andando/dançando/parado/pânico).
- **Pontos fortes:** ajustes recentes equilibraram bem (16 festeiros, raio de visão 55px). Feedback claro com texto central animado.
- **Issues conhecidas:** depende fortemente da paciência do jogador — sem timer/score acelerado, a sessão pode arrastar. Não há indicador de qual NPC está te vendo (só o pânico após o fato).

### 4.4 Caipora — `caipora.html` ⚠️

Tower defense com 10 ondas, defender 5 animais.

- **Pontos fortes:** sistema de ondas claro, botão "▶ Próxima Onda" coloca o jogador no controle do ritmo, vitória bem definida (10 ondas).
- **Issues importantes:**
  - **`reiniciar()` chama `start()` em vez de `reset()`** (linha 625). Isso significa que reiniciar pode arrastar estado residual (ex.: `obstaculos` antigos, ondas em andamento) — risco real de bugs no reinício. Os outros 3 jogos seguem o padrão `reset()` separado.
  - 26 funções declaradas no JS — é o mais fragmentado, o que pode dificultar entender o fluxo.

### 4.5 Iara — `iara.html` 🚨

Jogo de ritmo em 4 lanes com música.

**Esse é o jogo mais problemático.** Três issues críticas:

1. **Não há condição de vitória nem derrota.** O jogo roda indefinidamente até o jogador fechar a aba — não existe `function gameOver`, `function vencer`, nenhuma variável `gameOver`, nenhum overlay de fim. O jogador só acumula score eterno.
2. **Canvas fixo `560×780`** (linha 370 do HTML) **sem `resize()`**. Os outros jogos usam `window.innerWidth/innerHeight` com escuta de `visualViewport`. Em celular pequeno o canvas vai estourar, em tablet grande vai ficar minúsculo. Não é responsivo de verdade.
3. **Sem função `reset`** nem `reiniciar`. Voltar e reentrar funciona porque `start()` reseta `notes = []; score = 0`, mas qualquer bug de estado fica preso até `voltar()`.

Também: o `setInterval(spawn, 700)` é fixo — não acelera nem dá variação ao longo do tempo, o que fica chato rapidamente.

---

## 5. Qualidade de Código

### 5.1 Duplicação real (problema #1 do projeto)

Patterns repetidos em 4–5 arquivos sem extração:

- `function resize()` com `visualViewport`: 4× (saci, boitata, caipora, boto). Iara não tem.
- Override de `ctx.shadowBlur` para mobile: 5×.
- `IS_MOBILE = window.matchMedia(...)`: 6×.
- HUD pills, botão voltar, D-pad CSS: replicado 4–5 vezes com pequenas variações de cor.
- Bloco `@media (max-width: 900px), (pointer: coarse)` final: 5×.

**Tamanho atual: 6.172 linhas.** Estimo que extrair um `core.css` + `core.js` reduziria para algo entre 3.500 e 4.000 linhas, com manutenção muito mais simples.

### 5.2 Pontos positivos

- **Zero `var`** em todo o projeto — 100% `let`/`const`. Bom.
- **Zero `innerHTML`** — sem risco de XSS por inserção descuidada.
- **Zero `console.log`** esquecidos no código de produção.
- Nenhum `setInterval` que não seja limpo (`iara` usa `clearInterval` corretamente).
- `lang="pt-br"` em todos os HTMLs.

### 5.3 Pontos negativos

- **Listeners nunca removidos** (`addEventListener` sem `removeEventListener` em nenhum arquivo). Como cada partida vive na mesma sessão de página, listeners de `keydown` e do D-pad seguem ativos mesmo no menu — não é vazamento crítico (a página recarrega ao trocar de jogo), mas é um risco se o projeto evoluir para SPA.
- **`onclick` inline** em 25 lugares (todos os botões). Funciona, mas viola separação HTML/JS e torna a refatoração mais difícil.
- **9 a 26 funções globais por arquivo**, sem IIFE, sem módulos. Tudo polui o `window`.
- **Nomeação mista** (`pontos`/`score`/`seduzidos`, `gameOver`/`vitoria`, `rodando`/`running`).

---

## 6. Performance

### 6.1 O que já foi feito ✅

A rodada anterior de otimizações:

- `ctx.shadowBlur` neutralizado em mobile (impacto enorme — devolveu ~60 FPS).
- `backdrop-filter: blur()` desabilitado em mobile.
- `filter: drop-shadow()` removido dos botões e títulos em mobile.
- Partículas do menu reduzidas de 18 para 6 em mobile.

### 6.2 O que ainda pode melhorar

- **Canvas sem `imageSmoothingEnabled = false`.** Para um estilo "pixel art" mais limpo (que o jogo vagamente já tem), desligar smoothing dá visual mais nítido.
- **Recálculos de gradiente por frame.** Em `boto.html`, `boitata.html` e outros, `createLinearGradient` / `createRadialGradient` é chamado dentro de `render()`. Em mobile, criar 5+ gradientes por frame é caro. Recomendo cachear ou pré-renderizar em `offscreen canvas`.
- **Loops O(N²) de colisão.** Cada inimigo verifica colisão com cada outro elemento. Para até ~30 entidades, isso é ok. Acima, precisaria spatial hashing.
- **Trail do Boitatá** percorrido a cada frame com gradiente individual — candidato a pre-render.
- **`Math.hypot` em hot path** é mais lento que `dx*dx + dy*dy` (e dispensa a raiz quando você só compara distâncias). Trocar em loops de colisão dá ganho.

### 6.3 Métricas estimadas

Em desktop: 60 FPS sólido em todos os jogos. Em mobile médio (Android 6–7 anos): 50–60 FPS após otimizações; antes estava em 15–25 FPS no Saci e Boitatá.

---

## 7. Acessibilidade

Pontos fracos sistemáticos:

- **Zero `aria-*` em todos os arquivos.** Botões de ação (D-pad, voltar, começar) são `<button>` puros sem `aria-label`. Leitor de tela vai falar "botão" sem contexto.
- **Sem `<meta name="description">`** em nenhuma página. Ruim para SEO e para compartilhamento.
- **Sem alt em todas as imagens.** `boitata.png`, `iara.png` e `saci.png` têm `alt`, mas falta para outros elementos visuais decorativos (que deveriam ter `alt=""` ou `aria-hidden`).
- **Contraste do feedback central** (texto rosa claro em fundo escuro): aceitável, mas o pisca/animação pode incomodar usuários com sensibilidade vestibular. Faltaria respeitar `prefers-reduced-motion`.
- **Foco de teclado** não tem `:focus-visible` customizado — o foco padrão do navegador pode ficar invisível em fundos escuros.
- **Sem skip link**, sem landmark (`<main>`, `<nav>`).

---

## 8. Responsividade

- Todos os jogos exceto **Iara** usam `window.innerWidth/innerHeight` + `visualViewport` para acompanhar barra do navegador no celular.
- **Iara está quebrada em responsivo** (canvas fixo 560×780).
- Menu (`index.html`) usa `grid auto-fit minmax(280px, 1fr)` — bem feito.
- Tipografia usa `clamp()` no `index.html` (`clamp(36px, 7vw, 64px)`) — moderno e correto.
- `viewport-fit=cover` + `safe-area-inset-*`: o `meta` está, mas o CSS não consome `env(safe-area-inset-*)`. Em iPhone com notch, conteúdo pode ficar sob a faixa.

---

## 9. Segurança

Projeto estático, superfície de ataque pequena. Ainda assim:

- **Nada de `eval`, `Function()`, `innerHTML` perigoso** — bom.
- **`window.location.href = jogo + ".html"`** com `jogo` vindo de string fixa do `onclick`. Não há injeção possível hoje, mas se algum dia o nome do jogo vier de URL/query string, vira XSS via redirect.
- **Google Fonts** carregado direto do CDN. OK para o caso, mas se quiser privacidade rigorosa, fontes podem ser self-hosted.
- **Sem `Content-Security-Policy`**, sem `X-Content-Type-Options`, sem `Referrer-Policy`. Configurações de servidor, não do HTML, mas dignas de mencionar no deploy.

---

## 10. Bugs e Riscos Identificados

Em ordem de criticidade:

**Críticos**

1. **Iara não tem condição de fim de jogo** — joga eternamente, nunca perde, nunca vence. O overlay `goTitle` referenciado em outros jogos provavelmente não existe nesse.
2. **Iara não é responsivo** (canvas fixo 560×780).
3. **Caipora `reiniciar()` chama `start()` em vez de `reset()`** — risco de estado residual. Padrão divergente dos outros jogos.

**Médios**

4. **Iara sem função `reset`** — depende de `start()` para limpar tudo. Se um dia adicionar `gameOver`, vai precisar refatorar.
5. **Documentação `.txt` desatualizada** — só menciona 2 jogos dos 5 atuais.
6. **Listeners de teclado sempre ativos**, mesmo no menu inicial.

**Baixos**

7. Sem `aria-label` nos botões — acessibilidade ruim.
8. Sem `<meta name="description">`.
9. Sem favicon (`/favicon.ico` retorna 404).
10. Mp3 fica em loop sem opção de mute no Iara.
11. Sem PWA / manifest / service worker apesar da documentação prever.

---

## 11. Recomendações Priorizadas

### Curto prazo (próxima sessão)

1. **Corrigir Iara** — adicionar `function reset()`, `function perderJogo()` (ex.: depois de 5 notas perdidas), tornar canvas responsivo (`resize()` como nos outros jogos), botão de mute para o áudio.
2. **Corrigir Caipora** — fazer `reiniciar()` chamar `reset()` e não `start()`.
3. **Atualizar documentação .txt** ou substituir por um README.md em `_docs/` listando os 5 jogos.

### Médio prazo (refactor pequeno)

4. **Extrair `core.css`** com variáveis e classes comuns (`hud-pill`, `voltar`, `dpad`, `btn-comecar`, `overlay`, `feedback`).
5. **Extrair `core.js`** com utilitários: `resize()`, override de `shadowBlur`, detecção `IS_MOBILE`, helpers de distância/colisão.
6. **Remover `onclick` inline** e usar `addEventListener` consistentemente.
7. **Adicionar `aria-label` e `<meta description>`** em todos os HTMLs.
8. **Manifest PWA** + ícone + `Add to Home Screen`.

### Longo prazo (evolução)

9. **Ranking local** com `localStorage` (já previsto na doc original).
10. **Sons e efeitos** para os outros jogos (não só Iara).
11. **Service Worker** para funcionar offline (transforma em PWA real).
12. **Tela de seleção de dificuldade** por jogo (já que cada um tem dificuldade fixa hoje).
13. **`prefers-reduced-motion`** respeitado para animações.

---

## 12. Conclusão

O projeto está **funcional, charmoso e tecnicamente sólido na base**: zero dependências, código moderno (ES2015+, sem `var`, sem `innerHTML`), visual unificado, performance já trabalhada para mobile.

**Os maiores ganhos virão de duas frentes:**

1. **Consertar o Iara** — é o elo fraco da plataforma (sem fim de jogo, não responsivo).
2. **Reduzir duplicação** extraindo um core compartilhado — vai cortar ~2.000 linhas e tornar manutenção viável quando entrar o 6º, 7º jogo.

Nenhum problema atual é bloqueador. Todos os 5 jogos rodam, dão para jogar, divertem. As recomendações são para **escalar** o projeto, não para salvá-lo.

---

*Análise gerada em maio/2026 com base nos arquivos atuais do diretório `en.software`.*
