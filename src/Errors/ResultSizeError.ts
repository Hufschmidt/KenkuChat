/**
 * Custom error class to be thrown when not expecting to get result of given size.
 */
class ResultSizeError extends Error {
  /** Actuaky size of output */
  protected size: number;

  /**
   * Extends default constructor with custom name.
   * @param message The message attached to the exception
   */
  public constructor(message: string, size: number) {
    super(message);
    this.name = 'ResultSizeError';
    this.size = size;
  }

  /**
   * Returns the actual size of the result object.
   * @returns Acutal result size
   */
  public getSize(): number {
    return this.size;
  }
}

// Export custom error class
export {
  ResultSizeError,
};
