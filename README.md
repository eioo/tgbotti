# Tgbotti

## Installation & Usage

Copy `.env.example` to `.env` and setup your environment variables.

Then run:

```
yarn install
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
  bot.onText(/ping/, msg => {
    bot.sendMessage(msg.chat.id, 'pong');
  });
}

export { description, load };
```
