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

### Passing Arguments ###
The discord bot takes arguments either from the command line, eg.
```bash
npm run start -- --help
```

Or alternatively by using a json config file. By default it will read `config.json` inside this directory.
This can be changed by passing the `--config` argument, eg.
```bash
npm run start -- --config <path-to-config-file>
```

## Configuration ##
The discord bot supports the following configuration arguments, some of them are required as noted below:
- **applicationId**: (*Required*) The application identifier of the bot, used to register commands. (See [Setting Up](#Setting-Up) section)
- **config**: (*Optional*) Path to the configuration file (json format) to load arguments values from. (Default: `./config.json`)
- **prefix**: (*Optional*) Prefix used for all KenkuFM chat-commands registered with the server. (Default: kfm)
- **logging**: (*Optional*) Current logging level to be used, increase to debug for getting more output. (Default: info)
- **register**: (*Optional*) If enabled, the bot will register its slash-commands with discord. Note: This should only be done once! (Default: false)
- **serverId**: (*Optional*) The server identifier when updating slash-commands on a single server only. Otherwise slash-commands are updated globally.
- **token**: (*Required*) The oAuth2 token used by the bot for authentication.
- **url**: (*Optional*) URL under which the KenkuFM remote-control API is available, see KenkuFM > Settings > Remote. (Default: http://127.0.0.1:3333)

## Setting Up
**Work In Progress**

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
