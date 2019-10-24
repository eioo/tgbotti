# Tgbotti

## Installation

Copy `.env.example` to `.env` and setup your environment variables.

Then run:

```
yarn install
yarn migrate up
yarn start
```

## Commands

- Entrypoint for each command is `src/commands/<commandName>/index.ts`.
- Every command should have `load()` function defined and exported.

Example command:

```ts
import { bot } from '../../bot';

// This is optional
const description = 'Ping command';

function load() {
  bot.hears('ping', ctx => {
    ctx.reply('pong');
  });
}

export { description, load };
```
