import { getGitRemoteURL } from '../../utils/gitRemoteOrigin'
import { Commit, getCommitsByType } from '../parsers/commitParser'
import { getGithubUserInfo, GithubUserInfo } from '../utils/getGithubInfo'

// Which commit types belong under which section header
const commitLogGrouping = new Map<string, string[]>()
commitLogGrouping.set('Features', ['feat', 'perf'])
commitLogGrouping.set('Bug Fixes', ['fix'])
commitLogGrouping.set('Cleaning', ['refact', 'docs', 'style'])
commitLogGrouping.set('Tests', ['test'])
commitLogGrouping.set('Meta', ['build', 'ci'])

/**
 * @returns all of the commits organized into sections based on type
 * and formatted into markdown for use in the release
 */
export async function evaluateCommitLog (): Promise<string> {
  const headers = [...commitLogGrouping.keys()]
  const sections = await Promise.all(headers.map(async header => {
    const types = commitLogGrouping.get(header) as string[]

    return await evaluateCommitSection(header, types)
  }))

  const commitLog = sections.reduce((log, sec) => `${log}${sec}`, '')
  if (commitLog === '') {
    console.log('No significant changes have been added to this release')
  }
  return commitLog
}

/**
 * Grabs all commits related to every type and formats all of them
 * with the section header into a markdown chunk
 * @param header - the human readable header of the section
 * @param types - an array of commit types to include in this section
 * The order of the types determines the order they are displayed
 * @returns a markdown formatted changelog
 */
async function evaluateCommitSection (header: string, types: string[]): Promise<string> {
  const commits = types.map(t => getCommitsByType(t)).flat()
  if (commits.length === 0) return ''

  const sectionHeader = '# ' + header + '\n\n'
  const changes = await Promise.all(commits.map(async (c) => {
    const githubUserInfo = await getGithubUserInfo(c.email)
    return htmlifyCommit(githubUserInfo, c)
  }))
  const sec = changes.reduce((log, current) => `${log}${current}\n`, sectionHeader)
  return sec + '\n'
}

/**
 * Formats the line in the changelog into html for the markdown release
 * @param userInfo - the GitHub user information
 * @param commit - the commit information parsed from the git log
 * @returns the html code to place into the release body
 */
const htmlifyCommit = (userInfo: GithubUserInfo, commit: Commit): string =>
`<div>
  <a href="https://github.com/${userInfo.username}">
    <img valign="middle" alt="${userInfo.username}" src="https://images.weserv.nl/?url=${userInfo.avatar}?v=4&w=20&h=20&fit=cover&mask=circle" />
  </a>
  <span>
    <code><a href="${getGitRemoteURL()}/commit/${commit.hash}">${commit.hash.substring(0, 7)}</a></code>
    <b>${commit.type}</b>${commit.scope === undefined ? '' : `(${commit.scope})`}:
    ${commit.subject}
  </span>
</div>`
