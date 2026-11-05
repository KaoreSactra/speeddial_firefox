<div align="center">

# ⚡ Speed Dial

### A aba inicial do Firefox que você sempre quis ter.

Atalhos visuais, busca inteligente e **28 temas** — do Cyberpunk 2077 às ruínas Zonai de Hyrule.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-ready-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white)

</div>

---

## ✨ O que tem aqui

| | |
|---|---|
| 🎴 **Cards de atalho** | Grid de links com capa em cor/degradê, imagem do seu computador ou arte pronta (pastas *Gatos* e *Anime*). Adicione, edite, reordene e remova direto na tela. |
| 🔎 **Barra de pesquisa esperta** | Sugestões em tempo real, histórico, 5 mecanismos de busca e **atalhos por prefixo** (`yt lofi`, `gh next.js`, `ml teclado`…). |
| 🎨 **28 temas** | Cada um com paleta, formas, fontes e efeitos próprios. Alternância instantânea, sem "piscar" no carregamento. |
| 🌌 **Fundos animados** | Estrelas, chuva Matrix, neve, sakura, folhas, bolhas, brasas e luzes Zonai — tudo em canvas leve. |
| 💾 **100% local** | Seus cards, histórico e configurações ficam no `localStorage`. Sem conta, sem servidor, sem rastreio. |
| ♿ **Respeita o sistema** | Tema *Automático* segue claro/escuro do SO e `prefers-reduced-motion` desliga as animações pesadas. |

---

## 🎨 Temas

Os temas ficam organizados em pastas dentro das **Configurações**.

### 🟣 Kaore Theme — os destaques

<table>
<tr>
<td width="50%">

#### 🌃 Cyberpunk 2077
Amarelo-néon, ciano e magenta sobre preto. Cantos **cortados em diagonal**, moldura de HUD nos cantos da tela, scanlines com faixa de varredura, cards que entram com *glitch* e neon pulsando.

</td>
<td width="50%">

#### 🗡️ Zelda: Tears of the Kingdom
Pedra Zonai, brilho ciano das construções e **ouro real de Hyrule**. Raios de luz das ilhas do céu girando ao fundo, molduras duplas com losangos nos cantos, cards que ressurgem como no *Recall* e **levitam como no Ultrahand** ao passar o mouse. Fonte Cinzel.

</td>
</tr>
<tr>
<td>

#### 🌠 Intergaláctico
O tema original: roxo suave, estrelas ao fundo e brilho nos cards.

</td>
<td></td>
</tr>
</table>

### Todos os grupos

| Grupo | Temas |
|---|---|
| **Padrão** | Escuro · Claro · Automático (segue o sistema) |
| **Neon & Retrô** | Cyberpunk Neon · Terminal CRT verde · Terminal CRT âmbar · Synthwave · Matrix · Game Boy · Pixel Space 80s |
| **Natureza** | Floresta Zen · Oceano · Sakura |
| **Materiais** | Glassmorphism · Papel & Caderno · Neobrutalismo |
| **Minimalistas** | Nórdico · Dark OLED |
| **Editor de código** | Dracula · Catppuccin (Mocha, Macchiato, Frappé, Latte) · Nord |
| **Sazonais** | Halloween · Natal |

---

## 🔎 Busca com superpoderes

Digite um **prefixo + espaço + termo** e a busca vai direto ao site certo:

| Você digita | Vai para |
|---|---|
| `yt synthwave mix` | YouTube |
| `gh react` | GitHub |
| `a mouse gamer` | Amazon |
| `ml monitor` | Mercado Livre |
| `w Hyrule` | Wikipédia |
| `img gatos` | Google Imagens |
| `tr hello` | Tradutor |

- Prefixos **editáveis** nas Configurações — crie os seus com qualquer URL que use `%s` no lugar da busca.
- Mecanismos: **Google, DuckDuckGo, Bing, Brave Search e YouTube**.
- Sugestões vindas do mecanismo escolhido, com histórico local (e botão para limpar).

### ⌨️ Teclado

| Tecla | Ação |
|---|---|
| `/` ou `Ctrl/⌘ + K` | Focar a barra de pesquisa |
| `↑` `↓` | Navegar pelas sugestões |
| `Enter` | Buscar / abrir |
| `Esc` | Fechar sugestões |

---

## 🚀 Como rodar

Requisitos: **Node 20+** e **pnpm**.

```bash
git clone git@github.com:KaoreSactra/speeddial_firefox.git
cd speeddial_firefox
pnpm install
pnpm dev
```

Abra <http://localhost:3000>.

### Build de produção

```bash
pnpm build
pnpm start
```

### Usar como aba inicial do Firefox

1. Deixe o app rodando (`pnpm start`) ou publique-o em qualquer hospedagem.
2. Em **Configurações → Início**, defina *Página inicial e novas janelas* como **URLs personalizadas** e cole o endereço.
3. Para as **novas abas**, use uma extensão que redirecione a nova aba para essa URL (ex.: *New Tab Override*).

---

## 🧩 Personalizando

### Cards padrão
Edite [`src/json/containers.json`](src/json/containers.json): nome, URL e as duas cores do degradê.

```json
{ "id": 1, "name": "GitHub", "url": "https://github.com/", "color": "#64748b", "color2": "#1e293b" }
```

> Os cards salvos no navegador têm prioridade. Para ver mudanças no JSON, use **Restaurar os cards originais** no modo de edição.

### Capas prontas
Crie uma pasta em `public/img/containers/<categoria>/`, jogue as imagens lá e rode `pnpm dev`, `pnpm build` ou `pnpm presets`. A categoria aparece sozinha no editor de cards.

### Criar um tema novo

1. **Registre** em [`src/lib/theme.ts`](src/lib/theme.ts): id, nome, grupo, efeito de fundo e cores da miniatura.
2. **Estilize** com `[data-theme='seu-id'] { … }` em [`src/styles/themes.css`](src/styles/themes.css) usando os tokens:

```css
[data-theme='meu-tema'] {
  --bg: #0b0b12;            /* fundo base */
  --page-bg: radial-gradient(...), #0b0b12;
  --surface: #14141f;       /* barra, menus */
  --fg: #f5f5ff;            /* texto */
  --accent: #ff4fa3;        /* destaque */

  --card-bg: #14141f;
  --card-radius: 0.5rem;
  --card-shadow-hover: 0 0 24px #ff4fa3;
  --search-shadow-focus: 0 0 0 2px #ff4fa3;
}
```

3. Quer ir além? Os temas **Cyberpunk 2077** (`globals.css`) e **TOTK** (`totk.css`) mostram como usar `clip-path`, pseudo-elementos, `body::before/::after` e animações sem tocar nos componentes.

Fundos animados novos entram em `particlesFor()` em [`src/components/bg/component.tsx`](src/components/bg/component.tsx).

---

## 🗂️ Estrutura

```
src/
├── app/                 # layout, página inicial e /api/suggest (proxy de sugestões)
├── components/
│   ├── bg/              # partículas (tsparticles) e chuva Matrix
│   ├── cards/           # grid, editor e capa dos cards
│   ├── search/          # barra de pesquisa e configurações
│   └── theme/           # ThemeProvider
├── hooks/               # estado persistido (cards, busca, histórico)
├── json/                # cards padrão e presets de imagens
├── lib/                 # cards, busca, temas, storage
└── styles/              # globals.css · themes.css · totk.css · fonts.css
scripts/gen-presets.mjs  # indexa as imagens de public/img/containers
```

## 🛠️ Stack

**Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** · **Tailwind CSS 4** · **tsParticles** · **lucide-react**

---

<div align="center">

Feito com ☕ e muito CSS por **[Gus_Sactra](https://github.com/KaoreSactra)**

*It's dangerous to go alone! Take this.* 🗡️

</div>
