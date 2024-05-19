/**
 * Helper type-guard to ensure a value is non-empty, since typescript is not always able to auto-deduce this.
 */
const isDefined = <T>(element: T | null | undefined): element is T => {
  return element !== undefined && element !== null;
};

// Export content as module
export {
  isDefined,
};
