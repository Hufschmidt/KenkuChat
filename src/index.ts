// Import code from internal modules
import { BotApp } from './Discord/BotApp.js';
import { Config } from './Config/Config.js';

const config = new Config();
const app = new BotApp();
if (config.getArgument('register')) { await app.registerCommands(); }
await app.main();
