import { OctokitWrapper } from '../../API/octokitWrapper'
import { getPackageJson } from '../../utils/packageJson'
import { cleanVersionNumber } from '../../utils/version'
import { createChangelogTitle } from './changelogTitle'
import { getRepo } from './getGithubInfo'

const octokit = new OctokitWrapper()

/**
 * Sends the request to the github API to create a release
 * @param body - the body of the release, may be multiple lines
 */
export async function createRelease (body: string): Promise<void> {
  // Print changelog for debugging
  console.log('changelog generated: ', body)

  const version = cleanVersionNumber(getPackageJson().version)
  const data = {
    tag_name: `v${version}`,
    name: createChangelogTitle(),
    body,
    draft: false,
    prerelease: false,
    generate_release_notes: false
  }

  const repo = getRepo()
  const endpoint = `POST /repos/${repo}/releases`
  const response = await octokit.request(endpoint, data)

  if (response.data !== true) {
    console.error('Unable to create github release notes, data sent: ', data, 'and data returned', response.data)
  }
}
