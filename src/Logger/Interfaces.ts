// Import types from external modules
import type pino from 'pino/pino.js';

/** Type alias for current logging levels. */
type Levels = pino.Level;

/** Type alias for current logging-framework. */
type LoggerInterface = pino.Logger<Levels>;

// Export content as module
export {
  type Levels,
  type LoggerInterface,
}
