# You Need a Passphrase

[![CI](https://github.com/cdanielsen/next-long-pass/actions/workflows/ci.yml/badge.svg)](https://github.com/cdanielsen/next-long-pass/actions/workflows/ci.yml)

An app for generating a good long passphrase with an AI generated mnemonic to remember it.

## Tech Stack

Frontend:

- Bootstrapped with [vite](https://vitejs.dev/guide/) React + TypeScript template
- Plain CSS, no component library:
  - `src/styles/tokens.css`: every color, font and spacing value as CSS custom properties. Light by default; dark follows the system setting. Restyle the app here.
  - `src/styles/global.css`: reset and base element styles
  - CSS Modules (`*.module.css`) next to each component, sharing panels, labels and buttons from `src/styles/ui.module.css`
  - Responsive by wrapping (flex-wrap, `clamp()`), not breakpoints
- Fonts self-hosted via Fontsource: [Archivo](https://fonts.google.com/specimen/Archivo) (UI, wide uppercase titles) and [Martian Mono](https://fonts.google.com/specimen/Martian+Mono) (passphrase words)
- Inline SVG icons (`src/components/icons.tsx`)

AI mnemonic (UI):

- Off by default; nothing is sent until you pick a style
- After re-rolling words, waits 1s (`MNEMONIC_DEBOUNCE_MS`) so rapid re-rolls make a single request. Changing the style or pressing New mnemonic requests immediately.

Passphrases:

- Words drawn from the [EFF Large Wordlist](https://www.eff.org/dice) (7,776 words, ~12.9 bits each), licensed [CC BY 3.0 US](https://creativecommons.org/licenses/by/3.0/us/)
- Selected with `crypto.getRandomValues` (rejection sampling, no modulo bias)

Backend:

- `POST /api/mnemonic` [Netlify function](https://www.netlify.com/products/functions/) (`netlify/functions/mnemonic`) generates the AI mnemonic. The provider (currently OpenAI) is an implementation detail of the function.
  - Rate limited to 10 requests per minute per IP by Netlify (`config.rateLimit`). The platform rejects excess requests with a 429 before the function runs. `netlify dev` doesn't enforce the limit.
  - Errors return `{ "error": "<message>" }` with a complete, user-facing message. The UI shows it verbatim, so the server decides whether to suggest retrying:

    | Cause                                                   | Status              | Retry suggested |
    | ------------------------------------------------------- | ------------------- | --------------- |
    | Invalid request                                         | 400                 | –               |
    | Provider busy (upstream rate limit)                     | 503 + `Retry-After` | yes             |
    | Quota exhausted, bad key, unknown model, missing config | 503 / 500           | no              |
    | Any other provider failure                              | 502                 | yes             |
- `shared/` holds the request/response contract and limits used by both the frontend and the function

## Local Dev / Setup

Clone this repo

Install dependencies

```sh
npm install
```

Create a local env file

```sh
cp .env.example .env
```

| Variable       | Purpose                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `OPEN_AI_KEY`  | OpenAI API key. Use a Restricted project key with only **Model capabilities: Write**.          |
| `OPENAI_MODEL` | Optional model override (default `gpt-6-luna`). Must accept `reasoning_effort: "none"`.        |
| `MOCK_AI`      | `true` returns canned mnemonics without calling OpenAI (default for local dev). Unset in prod. |

Launch the netlify dev server (proxies Vite frontend dev server while also serving Netlify function locally)

```sh
npm run dev
```

Dev environment runs at localhost:8888 by default. `netlify dev` reads `.env` only at startup, so restart it after changing env vars.

Run unit tests

```sh
npm test
```

Run everything CI runs (lint, typecheck, tests, build, function bundle check)

```sh
npm run ci
```

Node version is pinned in `.nvmrc` (used by CI and Netlify); `nvm use` picks it up locally.
