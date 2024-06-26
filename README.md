# KenkuChat (Work in Progress)
Control KenkuFM using discord chat commands via custom bot.

## Installation ##

This software is written in [Typescript](https://www.typescriptlang.org) and transpiled to Javascript (*ES2022*) for execution with [NodeJS](https://nodejs.org).

* Download and install [NodeJS & NPM](https://nodejs.org) **16.0.0**<sup>\[1\]</sup> or above for your OS
* Install all requirements from `package.json` with:

  ```bash
  npm install
  ```

**\[1\]:** If you are using linux and your OS does not come with the requried version of NodeJS one can install upstream versions via NodeSource, eg.
<https://github.com/nodesource/distributions>

## Running ##

Ensure that the project has been [build](#development) first, afterwards the discord bot can be started with:

```bash
npm run start
```

## Development ##

The original source-code (*see `./src` directory*) is written in Typescript and needs to be transpiled to Javascript
(*see `./dist` directory*) that can be interpreted by NodeJS. This is implemented via the following command:

```bash
npm run build
```

It is advisable to check all changes to the source-code for common syntax and programming errors using:

```bash
npm run lint-ts
```

For better debugging capabilities it is possible to inspect the running npm process by starting it with:

```bash
npm run start-debug
```

This will start a local debugger instance (*see command output*) that can be connected to with tools
like [Chromium](https://www.chromium.org/Home) via the DevTools by navigating to <chrome://inspect/#devices>.
