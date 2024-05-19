// Import code from external modules
import { HTTPError, TimeoutError } from 'ky';

/**
 * Custom error class currently only used to wrap KenkuAPI error-handling.
 */
class KenkuError extends Error {
  /**
   * Extends default constructor with custom name.
   * @param message The message attached to the exception
   */
  public constructor(message: string) {
    super(message);
    this.name = 'KenkuError';
  }

  /**
   * Unify handling of exceptions thrown when talking to KenkuFM remote-control API.
   * @param error The exception that was thrown
   * @returns A string descripting the exception better
   */
  static handleException(exception: any, task: string): string {
    // Ensure that errors are seen, but also are passed down
    if (KenkuError.isUnavailableException(exception)) {
      return `KenkuFM remote-control API unavailable when trying to ${task}`;
    }
    if (KenkuError.isTimeout(exception)) {
      return `Got TimeoutError when trying ${task}: ${exception.message}`;
    }
    if (exception instanceof HTTPError) {
      return `Got HTTPError when trying to ${task}: ${exception.message}`;
    }
    if (exception instanceof Error) {
      return `Got generic Error when trying to ${task}: ${exception.message}`;
    }
    return `Got unexpected exception when trying to ${task}.`;
  }

  /**
   * Utility method for checking why an exception was thrown,
   * in this case the KenkuFM remote-control API being unavailable.
   * @param exception The exception that should be checked
   * @returns True if KenkuFM remote-control API is unavailable, false otherwise
   */
  static isUnavailableException(exception: any): boolean {
    return exception instanceof TypeError && exception.message === 'fetch failed';
  }

  /**
   * Utility method for checking why an exception was thrown,
   * in this case the KenkuFM remote-control API being unavailable.
   * @param exception The exception that should be checked
   * @returns True if KenkuFM remote-control API is unavailable, false otherwise
   */
  static isTimeout(exception: any): boolean {
    return exception instanceof TimeoutError;
  }
}

// Export custom error class
export {
  KenkuError,
};
