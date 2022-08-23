import { Octokit } from '@octokit/action'

export class OctokitWrapper {
  octokit: Octokit | undefined

  constructor () {
    try {
      this.octokit = new Octokit()
    } catch (e) {
      this.octokit = undefined
    }
  }
}
