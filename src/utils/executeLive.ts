
/**
 * Checks if the program is running in test mode and
 * executes the callback if not in test mode
 * @param callback - the function to run in live mode
 */
export function executeLive (callback: () => void): void {
  // If we are not running in test mode, run the callback
  if (process.env.JEST_WORKER_ID === undefined || process.env.NODE_ENV !== 'test') {
    callback()
  }
}
