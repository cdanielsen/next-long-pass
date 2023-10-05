# You Need a Passphrase

An app for generating a good long passphrase with an AI generated mnemonic to remember it.

## Tech Stack

Frontend:

- Bootstrapped with [vite](https://vitejs.dev/guide/) React + TypeScript template
- React Components and styling with [Chakra UI](https://chakra-ui.com/)
- Icons via [React Icons](https://react-icons.github.io/react-icons)

Backend:

- Open AI integration via [Netlify functions](https://www.netlify.com/products/functions/)

## Local Dev / Setup

Clone this repo

Install dependencies

```sh
npm install
```

Launch the netlify dev server (proxies Vite frontend dev server while also serving Netlify function locally)

```sh
npm run dev
```

Dev environment runs at localhost:8888 by default
