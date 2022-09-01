import { BadgeConfig } from './packageJson'

/**
 * @returns the default badge configs used in the package JSON
 */
export function getDefaultBadgeConfigs (): { [name: string]: BadgeConfig } {
  return {
    version: {
      label: 'Version',
      labelColor: '555555',
      primaryColor: '740e86',
      secondaryColor: '740e86',
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAggAAAIIBsKhZvgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFsSURBVCiRjZK9S9VxFMY/53df7EVocchBuIMtZtDUEA0N/QlKtIRUY2IOpYvQVIOLQZvU0OAiIlFDYM130oiIhMhRLmZBinC7eu+n5fuzy7036pnO23PO4TwHekA9p75S19TzvWo6Cf3qQ7XuHzTUJ+qZXoRMvanWUvEXdVy9pn5KsV11Si3kpLK6mpI/1Qdqua1pnzqj7qWaFbUU6ilgH1gG7kVE7fGsw8qjaHHiCKbn5uOrOggsAGNAfzE1zoCTEVG7P7lxwxaLwGkDCnB14vq72xGxnIZkAEU6sP1j7cr30odvlYHxzaPD5mH14+LA3kHtctroGF1EgHpjp7K5/XRoa2u38DcFsu4LswE02kK/size/5O4tDTzDGIUeA2sNpvNkWp1/oV6Fqi0TbCkrqsvk3+xQ45ykiiXY10t5clMvZTshfwBkl9U76qf1Ttq15Z5k1vpzVrqW3X0v44TEc+BC8AboN5xqGP8BvQuJ7II6OtVAAAAAElFTkSuQmCC',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    staleBranches: {
      label: 'Stale Branches',
      labelColor: '555555',
      primaryColor: '33ab53',
      secondaryColor: 'cf3b36',
      logo: 'Git',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    neglectedPrs: {
      label: 'Neglected PRs',
      labelColor: '555555',
      primaryColor: '33ab53',
      secondaryColor: 'cf3b36',
      logo: 'Git Extensions',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    lastProd: {
      label: 'Last Prod',
      labelColor: '555555',
      primaryColor: '33ab53',
      secondaryColor: 'cf3b36',
      gradient: [60, 0],
      logo: 'Android Auto',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    tests: {
      label: 'Tests',
      labelColor: '555555',
      primaryColor: '33ab53',
      secondaryColor: 'cf3b36',
      logo: 'TestCafe',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    coverage: {
      label: 'Coverage',
      labelColor: '555555',
      primaryColor: '33ab53',
      secondaryColor: 'cf3b36',
      gradient: [0, 100],
      logo: 'Buffer',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    linter: {
      label: 'Linter',
      labelColor: '555555',
      primaryColor: '33ab53',
      secondaryColor: 'cf3b36',
      logo: 'Integromat',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    vulnerabilities: {
      label: 'Vulnerabilities',
      labelColor: '555555',
      primaryColor: '33ab53',
      secondaryColor: 'cf3b36',
      logo: 'Amazon Cloudwatch',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    deprecations: {
      label: 'Deprecations',
      labelColor: '555555',
      primaryColor: '33ab53',
      secondaryColor: 'cf3b36',
      logo: 'Git LFS',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    nodeVersion: {
      label: 'Node Version',
      labelColor: '555555',
      primaryColor: '5c80f7',
      secondaryColor: '5c80f7',
      logo: 'Node.js',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    },
    npmVersion: {
      label: 'NPM Version',
      labelColor: '555555',
      primaryColor: '5c80f7',
      secondaryColor: '5c80f7',
      logo: 'npm',
      logoColor: 'ffffff',
      logoWidth: '14',
      style: 'for-the-badge'
    }
  }
}
