import { getGitRemoteURL } from '../../gitRemoteOrigin'
import { Commit, getCommitsByType } from '../commitParser'
import { getGithubUserInfo } from '../getGithubAvatar'

// Which commit types belong under which section header
const commitLogGrouping = new Map<string, string[]>()
commitLogGrouping.set('Features', ['feat', 'perf'])
commitLogGrouping.set('Bug Fixes', ['fix'])
commitLogGrouping.set('Cleaning', ['refact', 'docs', 'style'])
commitLogGrouping.set('Tests', ['test'])
commitLogGrouping.set('Meta', ['build', 'ci'])

const EMPTY_RELEASE = '**No significant changes have been added to this release**'

/**
 * @returns all of the commits organized into sections based on type
 * and formatted into markdown for use in the release
 */
export async function evaluateCommitLog (): Promise<string> {
  const headers = [...commitLogGrouping.keys()]
  const sections = await Promise.all(headers.map(async header => {
    const types = commitLogGrouping.get(header)
    if (types === undefined) return ''

    return await evaluateCommitSection(header, types)
  }))

  const commitLog = sections.reduce((log, sec) => `${log}${sec}`, '')
  return commitLog === '' ? EMPTY_RELEASE : commitLog
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
  const changes = await Promise.all(commits.map(async (c) => await formatCommit(c)))
  const sec = changes.reduce((log, current) => `${log}${current}\n`, sectionHeader)
  return sec + '\n'
}

/**
 * Formats a commit as:
 * " * [shortHash](linkToRemoteCommit) message"
 * @param commit - the commit line sent from the git log
 * @returns markdown formatted the changelog line
 */
async function formatCommit (commit: Commit): Promise<string> {
  const { hash, email, type, scope, subject } = commit
  const shortHash = hash.substring(0, 7)
  const remoteCommitURL = `${getGitRemoteURL()}/commit/${hash}`
  const avatar = await formatAvatar(email)

  const gv = '`'
  const hashLink = `[${gv}${shortHash}${gv}](${remoteCommitURL})`
  const scopeText = scope === undefined ? '' : `(${scope})`
  return `${avatar} ${hashLink} **${type}**${scopeText}: ${subject}`
}

/**
 * Formats the avatar image into markdown
 * @param email - the user's email to fetch the image from
 * @returns a markdown image
 */
async function formatAvatar (email: string): Promise<string> {
  const size = '20'
  const userInfo = await getGithubUserInfo(email)

  const sizedImageUrl = `https://images.weserv.nl/?url=${userInfo.avatar}&w=${size}&h=${size}&fit=cover&mask=circle`
  const userUrl = `https://github.com/${userInfo.username}`
  const imageMarkdown = `![${userInfo.username}](${sizedImageUrl})`
  return `[${imageMarkdown}](${userUrl})`
}
