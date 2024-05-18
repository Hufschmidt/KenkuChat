# KenkuChat (Work in Progress)
Control KenkuFM using discord chat commands via custom bot.

## Installation ##

This software is written in [Typescript](https://www.typescriptlang.org) and transpiled to Javascript (*ES2022*) for execution with [NodeJS](https://nodejs.org).

* Download and install [NodeJS & NPM](https://nodejs.org) **16.0.0**<sup>\[1\]</sup> or above for your OS
* Install<sup>\[2\]</sup> all requirements from `package.json` with:

  ```bash
  npm install
  ```

**\[1\]:** If you are using linux and your OS does not come with the requried version of NodeJS one can install upstream versions via NodeSource, eg.
<https://github.com/nodesource/distributions>

**\[2\]:** When installing behind a proxy, use cli parameter `--proxy http://www-proxy2.uni-marburg.de:3128` together with above `npm` command.

## Running ##

Ensure that the project has been [build](#development) first,
afterwards the script can be started with:

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

## Generating Discord Bot (WIP)
This project requires some configuration that is loaded from a `config.json` file in the same directory, see `config.spec.json` for an example.

- <https://discord.com/developers/applications>
- New Application
- To join Discord Server:
  - OAuth2
  - Enable: bot, application.commands
  - Copy "Generated URL"
  - Open in Browser an let Bot join discord
- To get required bot token
  - Bot
  - Reset Token
  - Store under config.json "token" key
- To get required application key
  - General Information
  - Copy APPLICATION ID
  - Store under config.json "applicationId" key
- To get required server id
  - Open Discord
  - User Settings
  - Advanced
  - Enable: Developer Mode
  - Escape / Close
  - Right-Click Your Server
  - Copy Server ID
  - Store under config.json "serverId" key

### First startup (WIP)
For the first startup, the bot needs to register the commands with your discord server,
this is currently not automated and must be done at least once, or any time the list of commands changes.

To do this, start the bot with the `--update` flag, eg.:
```bash
npm run start -- --update
```

## Supported Commands (WIP)
Name of commands will definitely change, for now we got:
- `/soundboards` - Gives a list of all soundboards (without included sounds for previty)
- `/sounds <name or id of soundboard>` - Gives a list of all sounds inside given soundboard
- `/sound <play|stop> <name or id of sound-track>` - Play or stop sound-track with given name or id
- `/status` - Shows information about currently playing soundboard sounds
