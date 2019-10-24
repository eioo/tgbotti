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

Commands are found in `src/commands` and it's subdirectories.

Every command should have `load()` function defined and exported.

Here is example command:

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
