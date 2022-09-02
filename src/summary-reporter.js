
/**
 * This is a reporter for jest that only prints the necessary information to stdout
 */
class CustomReporter {
  constructor (globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig
    this._options = reporterOptions
    this._context = reporterContext
  }

  onRunComplete (_testContexts, results) {
    const report = {
      numPassedTests: results.numPassedTests,
      numTotalTests: results.numTotalTests
    }
    console.log(JSON.stringify(report))
  }

  // Optionally, reporters can force Jest to exit with non zero code by returning
  // an `Error` from `getLastError()` method.
  getLastError () {
    if (this._shouldFail) {
      return new Error('Custom error reported!')
    }
  }
}

module.exports = CustomReporter
