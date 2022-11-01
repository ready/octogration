import { existsSync, readFileSync } from 'fs'
import { exit } from 'process'

if (existsSync('coverage/coverage-summary.json')) {
  const coverageReport = JSON.parse(readFileSync('coverage/coverage-summary.json').toString())
  const lines = coverageReport?.total?.lines?.pct ?? 100
  const statements = coverageReport?.total?.statements?.pct ?? 100
  const functions = coverageReport?.total?.functions?.pct ?? 100
  const branches = coverageReport?.total?.branches?.pct ?? 100

  let status = 0

  if (typeof lines === 'number' && lines < 100) {
    console.log(`The lines coverage is only at ${lines}%`)
    status = 1
  }

  if (typeof lines === 'number' && statements < 100) {
    console.log(`The statements coverage is only at ${statements}%`)
    status = 1
  }

  if (typeof lines === 'number' && functions < 100) {
    console.log(`The functions coverage is only at ${functions}%`)
    status = 1
  }

  if (typeof lines === 'number' && branches < 100) {
    console.log(`The branches coverage is only at ${branches}%`)
    status = 1
  }

  exit(status)
}
