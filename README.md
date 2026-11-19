# Next Passphrase

[![CI](https://github.com/cdanielsen/next-long-pass/actions/workflows/ci.yml/badge.svg)](https://github.com/cdanielsen/next-long-pass/actions/workflows/ci.yml)

Generates long, random passphrases that are easy to remember, with an optional AI-written sentence (a mnemonic) to help them stick.

- Words are picked in your browser from the [EFF Large Wordlist](https://www.eff.org/dice). Choose 3–6 words; the strength meter shows the entropy (about 12.9 bits per word).
- The AI mnemonic is **off by default**. Your words leave the device only after you pick a style (Standard or McConaughey).
- Light and dark mode follow your system setting, with a choice of three theme colors.

Inspired by [xkcd 936](https://xkcd.com/936/).

## How it works

Passphrases:

- Words drawn from the EFF Large Wordlist (7,776 words), licensed [CC BY 3.0 US](https://creativecommons.org/licenses/by/3.0/us/)
- Selected with `crypto.getRandomValues` (rejection sampling, no modulo bias)

AI mnemonic:

- `POST /api/mnemonic` is a [Netlify function](https://docs.netlify.com/functions/overview/) (`netlify/functions/mnemonic`). The provider (currently OpenAI) is an implementation detail of the function.
- After you re-roll words, the UI waits 1s (`MNEMONIC_DEBOUNCE_MS`), so rapid re-rolls make a single request for the final words. Changing the style or pressing New mnemonic requests immediately.
- Rate limited to 10 requests per minute per IP by Netlify (`config.rateLimit`). The platform rejects excess requests with a 429 before the function runs. `netlify dev` doesn't enforce the limit.
- Errors return `{ "error": "<message>" }` with a complete, user-facing message. The UI shows it verbatim, so the server decides whether to suggest retrying:

  | Cause                                                   | Status              | Retry suggested |
  | ------------------------------------------------------- | ------------------- | --------------- |
  | Invalid request                                         | 400                 | –               |
  | Provider busy (upstream rate limit)                     | 503 + `Retry-After` | yes             |
  | Quota exhausted, bad key, unknown model, missing config | 503 / 500           | no              |
  | Any other provider failure                              | 502                 | yes             |

## Tech stack

- [Vite](https://vite.dev/) + React 19 + TypeScript, [React Router](https://reactrouter.com/)
- Plain CSS, no component library:
  - `src/styles/tokens.css`: every color, font and spacing value as CSS custom properties. Light by default; dark follows the system setting. Restyle the app here.
  - `src/styles/global.css`: reset and base element styles
  - CSS Modules (`*.module.css`) next to each component, sharing panels, labels and buttons from `src/styles/ui.module.css`
  - Theme color picker (teal / blue / plum) in the Settings card: sets `<html data-accent>`, which swaps the accent tokens. The choice is saved in localStorage.
  - Responsive by wrapping (flex-wrap, `clamp()`), not breakpoints
- Fonts self-hosted via Fontsource: [Archivo](https://fonts.google.com/specimen/Archivo) (UI, wide uppercase titles) and [Martian Mono](https://fonts.google.com/specimen/Martian+Mono) (passphrase words)
- Inline SVG icons (`src/components/icons.tsx`)
- Netlify Functions (Node) + the `openai` SDK for the mnemonic
- Vitest + Testing Library, ESLint (typescript-eslint strict), Prettier; a husky pre-commit hook lints and formats staged files

## Project layout

```
src/
  components/      UI components, each with its CSS Module
  clients/mnemonic fetchMnemonic + useMnemonic (calls /api/mnemonic)
  hooks/           useTypedText (typewriter effect), useDebouncedCallback
  lib/             passphrase generation + entropy, theme color, EFF wordlist
  routes/          Generator (Root) and About pages
  styles/          tokens, global styles, shared UI classes
netlify/functions/mnemonic/
  index.ts         handler + Netlify config (path, rate limit)
  validate.ts      request validation
  prompt.ts        prompt per style
  errors.ts        provider error -> user-facing response
  mock.ts          canned mnemonics for MOCK_AI
shared/            request/response contract and word limits, used by both sides
```

## Local development

Requires the Node version in `.nvmrc` (`nvm use`).

```sh
npm install
cp .env.example .env
npm run dev
```

`npm run dev` starts `netlify dev` at http://localhost:8888, which proxies the Vite dev server and serves the function. `netlify dev` reads `.env` only at startup, so restart it after changing env vars. `npm run client:dev` runs Vite alone (the AI mnemonic won't work).

| Variable       | Purpose                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `OPEN_AI_KEY`  | OpenAI API key. Use a Restricted project key with only **Model capabilities: Write**.          |
| `OPENAI_MODEL` | Optional model override (default `gpt-6-luna`). Must accept `reasoning_effort: "none"`.        |
| `MOCK_AI`      | `true` returns canned mnemonics without calling OpenAI (default for local dev). Unset in prod. |

Checks:

```sh
npm test        # unit tests
npm run ci      # everything CI runs: lint, typecheck, tests, build, function bundle check
npm run format  # Prettier on the whole repo
```

## Deployment

Netlify builds `main` and posts a deploy preview on every pull request. The GitHub Actions `checks` job (`npm run ci`) must pass before merging.

Production env vars (Netlify site settings): set `OPEN_AI_KEY`, optionally `OPENAI_MODEL`, and leave `MOCK_AI` unset. A spending cap on the OpenAI project keeps an exhausted budget showing "AI mnemonics are unavailable right now" instead of running up a bill.
