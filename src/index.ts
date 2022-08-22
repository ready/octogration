import { updateBadges } from './badges/badges'
import { main as changelogMain } from './changelog/changelog'

// Temporary solution to adding both the badges and changelog to the same file
if (process.argv.length === 4) {
  changelogMain()
} else if (process.argv.length === 3) {
  void updateBadges()
} else {
  console.log('not valid')
}
