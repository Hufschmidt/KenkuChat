// Import code from external modules
import pino from 'pino';

// Import types from external modules
import type { Argv } from 'yargs';

/** List of arguments implemented by Config class. */
interface Arguments {
  /** Name of configuration file (json format) to load arguments values from. */
  config: string,
  /** Prefix used for all KenkuFM chat-commands registered with the server. */
  prefix: string,
  /** Current logging level to be used. */
  logging: pino.Level,
  /** URL under which the KenkuFM remote-control API is available. */
  url: string,
  /** Wether to print version and exit. */
  version: boolean,
  /** Contains (a list of) command(s) to be executed as well as all arguments. */
  _: string[],
}

/**
 * Define an abstraction for the yargs options parser for type safety.
 */
type ParserInterface = Argv<Arguments>;

// Export content as module
export {
  type Arguments,
  type ParserInterface,
}
