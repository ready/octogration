import { updateBadges } from './badges/badges'
import { main as changelog } from './changelog/changelog'
import { main as changelogTitle } from './changelog/changelogTitle'

// Temporary solution to adding both the badges and changelog to the same file
if (process.argv.length === 4) {
  changelog()
} else if (process.argv.length === 2) {
  void updateBadges()
} else if (process.argv.length === 3) {
  changelogTitle()
} else {
  console.log('octogration <subprocess>')
}
