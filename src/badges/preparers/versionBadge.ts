import { getPackageJson } from '../../utils/packageJson'
import { createURL, BadgeConfig } from '../badgesUtils'
import { cleanVersionNumber } from '../../utils/version'

const config: BadgeConfig = {
  label: 'Version',
  color: '740e86',
  style: 'for-the-badge',
  logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAggAAAIIBsKhZvgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFsSURBVCiRjZK9S9VxFMY/53df7EVocchBuIMtZtDUEA0N/QlKtIRUY2IOpYvQVIOLQZvU0OAiIlFDYM130oiIhMhRLmZBinC7eu+n5fuzy7036pnO23PO4TwHekA9p75S19TzvWo6Cf3qQ7XuHzTUJ+qZXoRMvanWUvEXdVy9pn5KsV11Si3kpLK6mpI/1Qdqua1pnzqj7qWaFbUU6ilgH1gG7kVE7fGsw8qjaHHiCKbn5uOrOggsAGNAfzE1zoCTEVG7P7lxwxaLwGkDCnB14vq72xGxnIZkAEU6sP1j7cr30odvlYHxzaPD5mH14+LA3kHtctroGF1EgHpjp7K5/XRoa2u38DcFsu4LswE02kK/size/5O4tDTzDGIUeA2sNpvNkWp1/oV6Fqi0TbCkrqsvk3+xQ45ykiiXY10t5clMvZTshfwBkl9U76qf1Ttq15Z5k1vpzVrqW3X0v44TEc+BC8AboN5xqGP8BvQuJ7II6OtVAAAAAElFTkSuQmCC'
}

/**
 * Parses the package.json file to find the version of the project
 * @returns the url encoding of the version badge
 */
export function prepareVersionBadge (): string {
  const packageJson = getPackageJson()
  const version = cleanVersionNumber(packageJson.version)
  return createURL({ ...config, message: version })
}
