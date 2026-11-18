# You Need a Passphrase

[![CI](https://github.com/cdanielsen/next-long-pass/actions/workflows/ci.yml/badge.svg)](https://github.com/cdanielsen/next-long-pass/actions/workflows/ci.yml)

An app for generating a good long passphrase with an AI generated mnemonic to remember it.

## Tech Stack

Frontend:

- Bootstrapped with [vite](https://vitejs.dev/guide/) React + TypeScript template
- React Components and styling with [Chakra UI](https://chakra-ui.com/)
- Icons via [React Icons](https://react-icons.github.io/react-icons)

Passphrases:

- Words drawn from the [EFF Large Wordlist](https://www.eff.org/dice) (7,776 words, ~12.9 bits each), licensed [CC BY 3.0 US](https://creativecommons.org/licenses/by/3.0/us/)
- Selected with `crypto.getRandomValues` (rejection sampling, no modulo bias)

Backend:

- `POST /api/mnemonic` [Netlify function](https://www.netlify.com/products/functions/) (`netlify/functions/mnemonic`) generates the AI mnemonic. The provider (currently OpenAI) is an implementation detail of the function.
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

Dev environment runs at localhost:8888 by default

Run unit tests

```sh
npm test
```

Run everything CI runs (lint, typecheck, tests, build, function bundle check)

```sh
npm run ci
```

Node version is pinned in `.nvmrc` (used by CI and Netlify); `nvm use` picks it up locally.
