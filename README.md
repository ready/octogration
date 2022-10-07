<p align="center">
  <img width="200" src="https://user-images.githubusercontent.com/82117023/164050250-34c6c370-2bba-413c-9655-61437820f094.svg" alt="Ready Logo">
</p>
<h1 align="center" style="margin-top: 0px;">
  Octogration &nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="version" src="https://img.shields.io/static/v1?label=Version&color=740e86&labelColor=555555&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAggAAAIIBsKhZvgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFsSURBVCiRjZK9S9VxFMY/53df7EVocchBuIMtZtDUEA0N/QlKtIRUY2IOpYvQVIOLQZvU0OAiIlFDYM130oiIhMhRLmZBinC7eu+n5fuzy7036pnO23PO4TwHekA9p75S19TzvWo6Cf3qQ7XuHzTUJ+qZXoRMvanWUvEXdVy9pn5KsV11Si3kpLK6mpI/1Qdqua1pnzqj7qWaFbUU6ilgH1gG7kVE7fGsw8qjaHHiCKbn5uOrOggsAGNAfzE1zoCTEVG7P7lxwxaLwGkDCnB14vq72xGxnIZkAEU6sP1j7cr30odvlYHxzaPD5mH14+LA3kHtctroGF1EgHpjp7K5/XRoa2u38DcFsu4LswE02kK/size/5O4tDTzDGIUeA2sNpvNkWp1/oV6Fqi0TbCkrqsvk3+xQ45ykiiXY10t5clMvZTshfwBkl9U76qf1Ttq15Z5k1vpzVrqW3X0v44TEc+BC8AboN5xqGP8BvQuJ7II6OtVAAAAAElFTkSuQmCC&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=0.14.0" />
</h1>
<p align="center">
  <img alt="staleBranches" src="https://img.shields.io/static/v1?label=Stale%20Branches&color=33ab53&labelColor=555555&logo=Git&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=0" /> &nbsp;
  <img alt="neglectedPrs" src="https://img.shields.io/static/v1?label=Neglected%20PRs&color=33ab53&labelColor=555555&logo=Git%20Extensions&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=0" /> &nbsp;
  <img alt="lastProd" src="https://img.shields.io/static/v1?label=Last%20Prod&color=33ab53&labelColor=555555&logo=Android%20Auto&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=9/7/22" />
</p>
<p align="center">
  <img alt="tests" src="https://img.shields.io/static/v1?label=Tests&color=33ab53&labelColor=555555&logo=TestCafe&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=530" /> &nbsp;
  <img alt="coverage" src="https://img.shields.io/static/v1?label=Coverage&color=33ab53&labelColor=555555&logo=Buffer&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=100%" /> &nbsp;
  <img alt="linter" src="https://img.shields.io/static/v1?label=Linter&color=33ab53&labelColor=555555&logo=Integromat&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=0" /> &nbsp;
  <img alt="vulnerabilities" src="https://img.shields.io/static/v1?label=Vulnerabilities&color=33ab53&labelColor=555555&logo=Amazon%20Cloudwatch&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=0" /> &nbsp;
  <img alt="deprecations" src="https://img.shields.io/static/v1?label=Deprecations&color=cf3b36&labelColor=555555&logo=Git%20LFS&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=1" />
</p>
<p align="center">
  <img alt="nodeVersion" src="https://img.shields.io/static/v1?label=Node%20Version&color=5c80f7&labelColor=555555&logo=Node.js&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=16.17.0" /> &nbsp;
  <img alt="npmVersion" src="https://img.shields.io/static/v1?label=NPM%20Version&color=5c80f7&labelColor=555555&logo=npm&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=8.3.1" /> &nbsp;
  <img alt="jestVersion" src="https://img.shields.io/static/v1?label=Jest%20Version&color=5c80f7&labelColor=555555&logo=Jest&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=28.1.3" /> &nbsp;
  <img alt="typescriptVersion" src="https://img.shields.io/static/v1?label=TS%20Version&color=5c80f7&labelColor=555555&logo=TypeScript&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=4.7.4" />
</p>


---

Octogration is a package designed to hook into GitHub's Octokit API and automate metadata about the project it is installed on.
It is used on this repository to dynamically update the readme badges and produce the changelog. All of this is done without requiring any developer attention.

## Features

### Dynamic Badges

Readme badges are a fun and useful tool to add an element of professionalism to a github readme. As seen above, they are rectangular images that include information and metadata about the project. There are several services that allow creation of dynamic badges, but typically require that the repository be public or requires giving a third party an authorized token.

Octogration allows developers to update their badges dynamically by relying on this NPM package run inside of a GitHub actions script. No authorization is required because the data is provided by GitHub, and the data never leaves the repository so it cannot be collected or abused.

We already support a number of dynamically updating badges and welcome suggestions for new badges.

### Automagic Changelog

Changelogs are a very convient method of keeping track of which updates were made when. However keeping track and remembering to update a changelog can be cumbersome work.

Octogration will automatically create a changelog and publish it to the `releases` tab on the GitHub repository it is installed in. The changelog includes metadata about when/where the changelog was created, some relevant dynamic badges, a written description of the changes, and a list of each change made.

The list of changes made is collected from the commits made since the last version was released. This makes it so developers don't have to remember back to what change they created and encourages more descriptive commit messages.

See our changelog [here](https://github.com/ready/octogration/releases).

## Usage

We've created a dummy repository with a basic setup of the package and nothing else [here](). If you'd like to see how it was designed to be set up and used, please check it out.

### Installation

Install Octogration as a developer dependency:

```
npm install --save-dev @ready.net/octogration
```

### Add to GitHub Actions

Running Octogration via command line must be done inside of a GitHub action. It can be ran outside of a GitHub action, but all calls to the GitHub API will return dummy mocked data and will only partially reflect the statistics of your repository.

Technically, Octogration can be called from any GitHub action, but we have some recommendations on a good place to put it. There are only a handful of formal requirements for the use inside of a GitHub action:

* All packages must be installed by `npm install` to run Octogration. If the deprecations badge is being used, then the standard error output of this command must be saved by `npm install 2>./.github/data/install_log.txt` . This is because currently NPM doesn't have any other way to check for package deprecations.
* All executions of the Octogration packages must have the github API token loaded in the environment. This is automatically encrypted by Github Actions and will never by seen by the Octogration package.

### Configuration Options

There are a number of configuration options that 

## TODO:

Add a license

Create dummy repository with config options set up
