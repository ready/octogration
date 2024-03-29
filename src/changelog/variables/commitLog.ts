import { getGitRemoteURL } from '../../utils/gitRemoteOrigin'
import { getPackageJson } from '../../utils/packageJson'
import { Commit, getAllCommits, getCommitsByType, RawCommit } from '../parsers/commitParser'
import { getGithubUserInfo, GithubUserInfo } from '../utils/getGithubInfo'
import htmlifyMarkdown from '../utils/htmlifyMarkdown'

/**
 * Checks the package JSON config to find the section headers and type sorting
 * If the `commitSections` field is a boolean, don't do any filtering
 * @param minimizeLevel - how many commits should be dropped from the log
 * @returns all of the commits organized into sections based on type
 * and formatted into markdown for use in the release
 */
export async function evaluateCommitLog (minimizeLevel: number): Promise<string> {
  const commitLogGrouping = getPackageJson().config.commitSections
  const evalAll = typeof commitLogGrouping === 'boolean'
  const commitLog = await (evalAll ? evaluateAllCommits(minimizeLevel) : evaluateAllSections(commitLogGrouping, minimizeLevel))

  if (commitLog === '') {
    console.log('Skipping: No significant changes have been added to this release')
    process.exit(0)
  }

  return minimizeLevel > 0 ? commitLog + '\n<i>Some commits have not been included.</i>' : commitLog
}

/**
 * Grabs all commits regardless of type and formats them in HTML
 * @param minimizeLevel - how many commits should be dropped from the log
 * @returns all changelog lines in HTML
 */
async function evaluateAllCommits (minimizeLevel: number): Promise<string> {
  const allCommits = getAllCommits()
  const commits = minimizeLevel > 1 ? allCommits.slice(0, -minimizeLevel) : allCommits

  const htmlBlocks = await Promise.all(commits.map(async c => {
    const githubUserInfo = await getGithubUserInfo(c.email)
    const htmlify = minimizeLevel > 0 ? htmlifyMiniRawCommit : htmlifyRawCommit
    return htmlify(githubUserInfo, c)
  }))

  return htmlBlocks.reduce((log, current) => `${log}${current}\n`, '')
}

/**
 * Uses the commit sections to sort the commits by section
 * @param commitSections - a map from headers to types included
 * @param minimizeLevel - how many commits should be dropped from the log
 * @returns all changelog sections in HTML/markdown
 */
async function evaluateAllSections (commitSections: { [type: string]: string[] }, minimizeLevel: number): Promise<string> {
  const headers = Object.keys(commitSections)
  const sections = await Promise.all(headers.map(async header => {
    const types = commitSections[header]
    return await evaluateCommitSection(header, types, minimizeLevel)
  }))

  return sections.reduce((log, sec) => `${log}${sec}`, '')
}

/**
 * Grabs all commits related to every type and formats all of them
 * with the section header into a markdown chunk
 * @param header - the human readable header of the section
 * @param types - an array of commit types to include in this section
 * The order of the types determines the order they are displayed
 * @param minimizeLevel - how many commits should be dropped from the log
 * @returns a markdown formatted changelog
 */
async function evaluateCommitSection (header: string, types: string[], minimizeLevel: number): Promise<string> {
  const commitsByType = types.map(t => getCommitsByType(t)).flat()
  const cap = Math.min(minimizeLevel, commitsByType.length)
  const commits = minimizeLevel > 1 ? commitsByType.slice(0, -cap) : commitsByType
  if (commits.length === 0) return ''

  const sectionHeader = '# ' + header + '\n\n'
  const changes = await Promise.all(commits.map(async c => {
    const githubUserInfo = await getGithubUserInfo(c.email)
    const htmlify = minimizeLevel > 0 ? htmlifyMiniCommit : htmlifyCommit
    return htmlify(githubUserInfo, c)
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
    ${htmlifyMarkdown(commit.subject)}
  </span>
</div>`

/**
 * Formats the line in the changelog into html for the markdown release.
 * Does not format the message.
 * @param userInfo - the GitHub user information
 * @param commit - the raw commit info without type or scope
 * @returns the html code to place into the release body
 */
const htmlifyRawCommit = (userInfo: GithubUserInfo, commit: RawCommit): string =>
 `<div>
   <a href="https://github.com/${userInfo.username}">
     <img valign="middle" alt="${userInfo.username}" src="https://images.weserv.nl/?url=${userInfo.avatar}?v=4&w=20&h=20&fit=cover&mask=circle" />
   </a>
   <span>
     <code><a href="${getGitRemoteURL()}/commit/${commit.hash}">${commit.hash.substring(0, 7)}</a></code>
     ${htmlifyMarkdown(commit.message)}
   </span>
 </div>`

/**
 * Formats the line in the changelog into html for the markdown release.
 * This version is minified to reduce character size.
 * @param userInfo - the GitHub user information
 * @param commit - the commit information parsed from the git log
 * @returns the html code to place into the release body
 */
const htmlifyMiniCommit = (userInfo: GithubUserInfo, commit: Commit): string => `<div><a href="https://github.com/${userInfo.username}"><img valign="middle" src="https://images.weserv.nl/?url=${userInfo.avatar}?v=4&w=20&h=20&fit=cover&mask=circle" /></a><span><code><a href="${getGitRemoteURL()}/commit/${commit.hash}">${commit.hash.substring(0, 7)}</a></code><b>${commit.type}</b>${commit.scope === undefined ? '' : `(${commit.scope})`}: ${htmlifyMarkdown(commit.subject)}</span></div>`

/**
 * Formats the line in the changelog into html for the markdown release.
 * This version is minified to reduce character size.
 * Does not format the message.
 * @param userInfo - the GitHub user information
 * @param commit - the raw commit info without type or scope
 * @returns the html code to place into the release body
 */
const htmlifyMiniRawCommit = (userInfo: GithubUserInfo, commit: RawCommit): string => `<div><a href="https://github.com/${userInfo.username}"><img valign="middle" src="https://images.weserv.nl/?url=${userInfo.avatar}?v=4&w=20&h=20&fit=cover&mask=circle" /></a><span><code><a href="${getGitRemoteURL()}/commit/${commit.hash}">${commit.hash.substring(0, 7)}</a></code>${htmlifyMarkdown(commit.message)}</span></div>`
