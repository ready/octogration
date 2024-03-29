import { getPackageJson } from '../../utils/packageJson'
import { createURL } from '../badgesUtils'
import { interpolateProgessColor } from '../../utils/interpolateColor'

/**
 * Uses the verison number to determine the date of last prod release
 * @returns the url encoding of the last production badge
 */
export function prepareLastProdBadge (oldBadge: string): string {
  const config = getPackageJson().config.badgeConfigs.lastProd
  const MAX_AGE = 60
  const lastProdDate = getLastProdDate(oldBadge)
  const age = lastProdDate === '?/?/??' ? MAX_AGE : daysOld(lastProdDate)

  const color = interpolateProgessColor(1 - age / MAX_AGE)
  const message = lastProdDate
  return createURL({ ...config, message, color })
}

/**
 * Determines if this release is production or not and returns the date of the last prod
 * @param oldBadge - the badge that is currently in the readme,
 * with '-prod' or '-none' appended
 * @returns the date of the last production release in 1/1/11 format
 */
function getLastProdDate (oldBadge: string): string {
  try {
    // If this release is a production release,
    // then today is the newest release
    if (oldBadge.endsWith('%%~prod')) {
      return todayLocalDate()
    }

    // If this release isn't production
    // then we can just use the old date
    const urlFields = oldBadge.split('?')
    const config = urlFields[1].split('&')
    const oldDateField = config.find(p => p.startsWith('message='))
    const oldDate = oldDateField?.split('=')[1] ?? '?/?/??'

    return oldDate
  } catch {
    return '?/?/??'
  }
}

/**
 * @returns today's date in 1/1/11 format
 */
function todayLocalDate (): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  }
  return (new Date()).toLocaleDateString('en-US', dateOptions)
}

/**
 * @param date - the date to check the age of
 * @returns the number of days between the date and today
 */
function daysOld (date: string): number {
  const currentTime = (new Date()).getTime()
  const dateTime = (new Date(date)).getTime()
  const daysOld = (currentTime - dateTime) / (1000 * 3600 * 24)
  return daysOld < 1 ? 0 : daysOld
}
