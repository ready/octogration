import { OctokitWrapper } from '../../API/octokitWrapper'
import { getGitRemoteURL } from '../../utils/gitRemoteOrigin'

const octokit = new OctokitWrapper()

interface GithubUserInfo {
  username: string
  avatar: string
}

// Requesting the URL is time consuming, so we cache the results here
const contributors = new Map<string, GithubUserInfo>()

// When there is an error,
// submit a default contributor so the release still gets published
const defaultContributor: GithubUserInfo = {
  username: 'ready',
  avatar: 'https://avatars.githubusercontent.com/u/63874247?s=200&v=4'
}

/**
 * Requests the github API to send the URL of the info of a user
 * Caches the response so it only sends one API request per email
 * @param userEmail - the email of the user to look them up with
 * @returns a URL to the avatar image hosted by github
 * and the username of the user
 */
export async function getGithubUserInfo (userEmail: string): Promise<GithubUserInfo> {
  try {
    const contributor = contributors.get(userEmail)
    if (contributor === undefined) {
      const requestedInfo = await requestGithubUserInfo(userEmail)
      contributors.set(userEmail, requestedInfo)
      return requestedInfo
    }

    return contributor
  } catch (e) {
    // We don't want to halt the release for a parsing error
    // So use the default contributor if an error occurs
    console.error(e)
    return defaultContributor
  }
}

/**
 * Requests the user's information from the API using their email
 * @param userEmail - the user's email from which to fetch
 * @returns a URL to the avatar image hosted by github
 * and the username of the user
 */
async function requestGithubUserInfo (userEmail: string): Promise<GithubUserInfo> {
  const repo = getRepo()
  const search = `per_page=1&author=${userEmail}`
  const endpoint = `/repos/${repo}/commits?${search}`
  const response = await octokit.request(`GET ${endpoint}`)

  return {
    username: response.data[0].author.login,
    avatar: response.data[0].author.avatar_url
  }
}

/**
 * @returns the name of the repository
 */
export function getRepo (): string {
  const prefix = 'https://github.com/'
  const remoteURL = getGitRemoteURL()

  if (!remoteURL.startsWith(prefix)) {
    throw new Error(`Malformed URL ${remoteURL} does not begin with ${prefix}`)
  }

  return remoteURL.substring(prefix.length)
}
