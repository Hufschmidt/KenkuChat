// Import code from internal modules
import { BotApp } from './Discord/BotApp.js';
import { Config } from './Config/Config.js';

// Create configuration and bot-application
const config = new Config();
const app = new BotApp();

// Register commands when requested and start application
if (config.getArgument('register')) { await app.registerCommands(); }
await app.main();
