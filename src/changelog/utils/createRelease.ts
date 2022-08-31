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
  const version = cleanVersionNumber(getPackageJson().version)

  const repo = getRepo()
  const endpoint = `POST /repos/${repo}/releases`
  await octokit.request(endpoint, {
    tag_name: `v${version}`,
    name: createChangelogTitle(),
    body,
    draft: false,
    prerelease: false,
    generate_release_notes: false
  })
}
