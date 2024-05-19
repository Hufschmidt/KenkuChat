// Import code from external modules
import pino from 'pino/pino.js';
import pretty from 'pino-pretty';

// Import code from internal modules
import { Config } from '../Config/Config.js';

// Import types from internal modules
import type { LoggerInterface } from './Interfaces.js';

/**
 * Factory for creating (pre-configured) Log instances.
 * @param className Name of class in which logger is used
 * @returns New pino.logger instances for writing to console
 */
const LoggerFactory = (className: string): LoggerInterface => {
  // Fetch configuration
  const config = new Config();
  const level = config.getArgument('logging');

  // Create new pretty destination
  const destination = pretty.PinoPretty(<any> {
    colorize: true,
    useOnlyCustomProps: true,
  });

  // Create new logger instance with preset configuration
  return pino.pino({
    name: className,
    level: level,
    errorKey: 'error',
    serializers: {
      error: (input: Error) => { return { type: input.name, message: input.message }; },
    },
  }, destination);
}

// Export content as module
export {
  LoggerFactory,
}
