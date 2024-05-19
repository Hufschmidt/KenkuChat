// Import code from external modules
import pino from 'pino';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

// Import types from internal modules
import type { Arguments, ParserInterface } from './Interfaces.js';

/**
 * Implements parsing of CLI arguments and commands to be executed.
 * Can optionally read configuration from a JSON-formated file.
 */
class Config {
  /** Stores all configuration values after beeing parsed by yargs */
  protected arguments: Arguments;

  /** Stores a reference to the configured yargs instance */
  protected parser: ParserInterface;

  /**
   * Creates a new config instance and parses input/configuration
   * into the interal argument array.
   * @throws
   */
  public constructor() {
    // Create a yargs instance
    this.parser = <ParserInterface> yargs(hideBin(process.argv));

    // Basic CLI parser configuration
    this.parser
      .scriptName('npm run start')
      .usage('npm run start [-- <Arguments>]')
      .wrap(this.parser.terminalWidth())
      .locale('en');

    // Add --config argument (and default to config.json)
    this.parser
      .config()
      .default('config', 'config.json');

    // Add --logging argument (and default to info)
    this.parser.option('logging', {
      describe: 'Global log-level of application.',
      nargs: 1,
      type: 'string',
      choices: Object.keys(pino.levels.values),
      default: 'info',
      demandOption: true,
      global: true,
    });

    // Add --version argument
    this.parser.version();

    // Add --url argument (defaults to http://127.0.0.1:3333)
    this.parser.option('url', {
      describe: 'URL under which the KenkuFM remote-control API is available.',
      nargs: 1,
      type: 'string',
      default: 'http://127.0.0.1:3333',
      demandOption: true,
      global: true,
    });

    // Add --prefix argument (defaults to kfm)
    this.parser.option('prefix', {
      describe: 'Prefix used for all KenkuFM chat-commands registered with the server.',
      nargs: 1,
      type: 'string',
      default: 'kfm',
      demandOption: true,
      global: true,
    });

    // Add --token argument
    this.parser.option('token', {
      describe: 'The oAuth2 token used by the bot for authentication.',
      nargs: 1,
      type: 'string',
      demandOption: true,
      global: true,
    });

    // Add --application-id argument
    this.parser.option('applicationId', {
      describe: 'The application identifier of the bot, used to register commands.',
      nargs: 1,
      type: 'string',
      demandOption: true,
      global: true,
      coerce: (value: number | string): string => { return (typeof value === 'string') ? value : value.toString(); },
    });

    // Add --server-id argument
    this.parser.option('serverId', {
      describe: 'The (optional) server identifier when updating slash-commands on a single server only.',
      nargs: 1,
      type: 'string',
      demandOption: true,
      global: true,
      coerce: (value: number | string): string => { return (typeof value === 'string') ? value : value.toString(); },
    });

    // Add --register option (default: false)
    this.parser.option('register', {
      describe: 'If enabled, the bot will register its slash-commands with discord.',
      type: 'boolean',
      boolean: true,
      default: false,
    });

    // Parse all arguments
    this.arguments = this.parser.parseSync();
  }

  /**
   * Executes the argument and command parsing logic and
   * returns the value of the requested argument.
   * @typeparam K Generic used together with auto-type deduction to set correct return-type based on key-value
   * @param key The argument whose value should be returned
   * @returns Value of requested argument
   */
  public getArgument<K extends keyof Arguments>(key: K): Arguments[K] {
    // Return requested argument
    return this.arguments[key];
  }

  /**
   * Show help on console and exit application.
   * @throws
   */
  public showHelp(): void {
    this.parser.showHelp();
  }
}

// Export content as module
export {
  Config,
};
