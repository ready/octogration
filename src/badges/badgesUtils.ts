
export interface BadgeParams {
  label: string
  color: string
  labelColor: string
  logo: string
  logoColor: string
  logoWidth: string
  style: string
  message: string
}

/**
 * @param params - The parameters passed by the preparation function
 * @returns the URL encoded with the necessary parameters
 */
export function createURL (params: BadgeParams): string {
  const sendableParams = parseUrlParams(params)
  const keys = Object.keys(sendableParams)
  const stringifiedParams = keys.map(param => {
    const paramValue = sendableParams[param]
    if (paramValue === undefined) return ''
    return `${param}=${paramValue}`
  })

  const encodedParams = stringifiedParams.reduce((url, nextParam) => nextParam === '' ? url : `${url}&${nextParam}`)
  return `https://img.shields.io/static/v1?${encodedParams}`.replaceAll(' ', '%20')
}

interface UrlParams {
  [key: string]: string | undefined
}

/**
 * @param params - The parameters passed by the preparation function
 * @returns the filtered parameters that will be encoded into the URL
 */
function parseUrlParams (params: BadgeParams): UrlParams {
  return {
    label: params.label,
    color: params.color,
    labelColor: params.labelColor,
    logo: params.logo,
    logoColor: params.logoColor,
    logoWidth: params.logoWidth,
    style: params.style,
    message: params.message
  }
}
