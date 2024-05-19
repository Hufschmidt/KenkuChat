/**
 * Custom error class to be thrown when requested element does not exist.
 */
class DoesNotExistError extends Error {
  /**
   * Extends default constructor with custom name.
   * @param message The message attached to the exception
   */
  public constructor(message: string) {
    super(message);
    this.name = 'DoesNotExistError';
  }
}

// Export custom error class
export {
  DoesNotExistError,
};
