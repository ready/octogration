<p align="center">
  <img width="200" src="https://user-images.githubusercontent.com/82117023/164050250-34c6c370-2bba-413c-9655-61437820f094.svg" alt="Ready Logo">
</p>
<h1 align="center" style="margin-top: 0px;">
  Octogration &nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="version" src="https://img.shields.io/static/v1?label=Version&color=740e86&labelColor=555555&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAggAAAIIBsKhZvgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFsSURBVCiRjZK9S9VxFMY/53df7EVocchBuIMtZtDUEA0N/QlKtIRUY2IOpYvQVIOLQZvU0OAiIlFDYM130oiIhMhRLmZBinC7eu+n5fuzy7036pnO23PO4TwHekA9p75S19TzvWo6Cf3qQ7XuHzTUJ+qZXoRMvanWUvEXdVy9pn5KsV11Si3kpLK6mpI/1Qdqua1pnzqj7qWaFbUU6ilgH1gG7kVE7fGsw8qjaHHiCKbn5uOrOggsAGNAfzE1zoCTEVG7P7lxwxaLwGkDCnB14vq72xGxnIZkAEU6sP1j7cr30odvlYHxzaPD5mH14+LA3kHtctroGF1EgHpjp7K5/XRoa2u38DcFsu4LswE02kK/size/5O4tDTzDGIUeA2sNpvNkWp1/oV6Fqi0TbCkrqsvk3+xQ45ykiiXY10t5clMvZTshfwBkl9U76qf1Ttq15Z5k1vpzVrqW3X0v44TEc+BC8AboN5xqGP8BvQuJ7II6OtVAAAAAElFTkSuQmCC&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=0.14.1" />
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

#### Add to GitHub Actions

Running Octogration via command line must be done inside of a GitHub action. It can be ran outside of a GitHub action, but all calls to the GitHub API will return dummy mocked data and will only partially reflect the statistics of your repository.

Technically, Octogration can be called from any GitHub action, but we have some recommendations on a good place to put it. There are only a handful of formal requirements for the use inside of a GitHub action:

* All packages must be installed by `npm install` to run Octogration. If the deprecations badge is being used, then the standard error output of this command must be saved by `npm install 2>./.github/data/install_log.txt` . This is because currently NPM doesn't have any other way to check for package deprecations.
* All executions of the Octogration packages must have the github API token loaded in the environment. This is automatically encrypted by Github Actions and will never by seen by the Octogration package.

#### Add `testSummary` Script

When using the `test` and `coverage` badges, it will attempt to run the `testSummary` script in your `package.json`. It is expecting a Jest formatted output in standard error. The [reporter](https://jestjs.io/docs/configuration#reporters-arraymodulename--modulename-options) should be `summary` and the [coverage reporter](https://jestjs.io/docs/configuration#coveragereporters-arraystring--string-options) should be `json-summary`.

#### Add `lint` Script

When using the `linter` badge, it will attempt to run the `lint` script in your `package.json`. Each line of the standard output is counted as a single linter error, as this is the format most linters use. 

Depending on your linter, it may require some additional configurations. For example, `ts-standard` prints some extra formatting to standard error so simply making `"lint": "ts-standard 2> /dev/null"` is sufficient for making the badge work properly.

### Configuration Options

There are a number of configuration options that Octogration will read from your project's `package.json` to determine how to format the changelog and badges. A stripped version of your `package.json` will generally look like this:

```json
{
  "name": "your project name",
  "version": "1.1.1",
  "dependencies": {
    "@ready.net/octogration": "^0.15.0"
  },
  "@ready/octogration": {
    "configName": "value"
  }
}
```

Each configuration name, accepted values, and default values are listed below.

#### dateTimeLocal

Used for formatting the timestamp in the changelog releases. 

Accepts any `Date.toLocaleString(datetimeLocal, datetimeOptions)` [international locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#locales).

Default: `"dateTimeLocal": "en-US"`

#### datetimeOptions

Used for formatting the timestamp in the changelog releases.

Accepts any `Date.toLocaleString(datetimeLocal, datetimeOptions)` [international option object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options).

Default:

```json
"datetimeOptions": {
  "weekday": "long",
  "day": "numeric",
  "year": "2-digit",
  "month": "2-digit",
  "hour": "numeric",
  "minute": "2-digit",
  "hour12": true,
  "timeZone": "America/Los_Angeles",
  "timeZoneName": "short"
}
```

#### commitSections

Used to create & sort commit sections in the changelog. If your commit messages follow the [conventional commits](https://www.conventionalcommits.org/) standard, then Octogration will parse the commit messages and sort them into sections defined in this config option.

Accepts either `false` which will not sort or create any sections, or an object whose fields are the names of section titles and values are arrays of commit types. There is no hardcoded list of accepted commit types, you can define any single token type for Octogration to find and sort. 

If the option has commit sections and there is a commit message that either does not follow the conventional commits standard or has a type not listed in this configuration, then that commit message will not be included in the changelog. If there are no valid commits to be included, then no changelog will be created.

Example:

```json
"commitSections": {
  "Features": ["feat", "perf"],
  "Bug Fixes": ["bug"]
}
```

Default: `"commitSections": false`

#### includePrTitleDev

Flag to include the **title** of a PR creating a **development** release in the changelog. If true, Octogration will grab the PR by the number provided in the command line and insert the title into the changelog.

Accepts a boolean.

Default: `"includePrTitleDev": true`

#### includePrTitleProd

Flag to include the **title** of a PR creating a **production** release in the changelog. If true, Octogration will grab the PR by the number provided in the command line and insert the title into the changelog.

Accepts a boolean.

Default: `"includePrTitleProd": true`

#### includePrBodyDev

Flag to include the **body** of a PR creating a **development** release in the changelog. If true, Octogration will grab the PR by the number provided in the command line and insert the title into the changelog.

Accepts a boolean.

Default: `"includePrBodyDev": true`

#### includePrBodyProd

Flag to include the **body** of a PR creating a **production** release in the changelog. If true, Octogration will grab the PR by the number provided in the command line and insert the title into the changelog.

Accepts a boolean.

Default: `"includePrBodyProd": true`

#### writeChangelogToFile

Flag to write information about the release to file. Writes the title & body of the PR creating the changelog, the version, the environement, and the timestamp to a JSON file. 

Accepts a boolean.

Default: `"writeChangelogToFile": true`

#### changelogFileName

The filename of the changelog file when it gets written to. Only used if `writeChangelogToFile` is `true`. The current working directory is the same directory as your `package.json` file.

Accepts a string.

Default: `"changelogFileName": "automatic_changelog.json"`

#### badgeConfigs

This is a group of more configuration options for each badge. There are several badges that are recognized by Octogration and the option to include the version of any dependency in your project.

Each badge config uses the same format, as described below. All colors are 6 digit hex colors without the leading #.

```json
"badgeName": {
  label: "The text to display on the badge on the left",
  labelColor: "Color of left background",
  primaryColor: "Color of right background",
  secondaryColor: "Color of right background when event triggers (different per badge)",
  gradient: [0, 100] // starting and ending values for gradient badges (different per badge)
  logo: "base 64 image encoding or simpleicons.org name",
  logoColor: "Color of logo (only used for some simpleicons)",
  logoWidth: "Number of pixels to make the logo's width",
  style: "Badge style for rendering, see shields.io for options"
}
```

##### version

Has the current version of your `package.json` file.

Default:

```json
"version": {
  label: "Version",
  labelColor: "555555",
  primaryColor: "740e86",
  secondaryColor: "740e86",
  logo: // base 64 encoding of Ready's Logo
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### staleBranches

The number of stage branches on GitHub (no activity for 120 days on unprotected branches). Uses `primaryColor` when there are no stale branches.

Default:

```json
"staleBranches": {
  label: "Stale Branches",
  labelColor: "555555",
  primaryColor: "33ab53",
  secondaryColor: "cf3b36",
  logo: "Git",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### neglectedPrs

The number of neglected PRs on GitHub (no activity for 4 days). Uses `primaryColor` when there are no neglected PRs.

Default:

```json
"neglectedPrs": {
  label: "Neglected PRs",
  labelColor: "555555",
  primaryColor: "33ab53",
  secondaryColor: "cf3b36",
  logo: "Git Extensions",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### lastProd

The date of the last production release. Calculates the `age` as the number of days since the last production release. The gradient config option here says to use the `secondaryColor` for an age of `60` or greater and use `primaryColor` for an age of `0` or less. An age between those values will interpolate between those colors. By default, an age of `30` will be yellow (halfway between the green and red colors.

Default:

```json
"lastProd": {
  label: "Last Prod",
  labelColor: "555555",
  primaryColor: "33ab53",
  secondaryColor: "cf3b36",
  gradient: [60, 0],
  logo: "Android Auto",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### tests

Calculates the number of Jest tests in the repository. Runs the `testSummary` script in the project. Uses `primaryColor` when all tests pass.

Default:

```json
"tests": {
  label: "Tests",
  labelColor: "555555",
  primaryColor: "33ab53",
  secondaryColor: "cf3b36",
  logo: "TestCafe",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### coverage

Calculates the Jest test coverage as a percentage. Runs the `testSummary` script in the project.

The gradient config option here says to use `secondaryColor` for a percentage of `0` or less and `primaryColor` for a percentage of `100` or greater. A percentage between those values will interpolate between those colors. By default, a coverage of 25% will color the badge an orange color (a quarter of the way between red and green).

Default:

```json
"coverage": {
  label: "Coverage",
  labelColor: "555555",
  primaryColor: "33ab53",
  secondaryColor: "cf3b36",
  gradient: [0, 100],
  logo: "Buffer",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### linter

The number of linter errors in the project. Runs the `lint` script in the project. Uses `primaryColor` when there are zero linter errors (the linter prints no lines in the console).

Default:

```json
"linter": {
  label: "Linter",
  labelColor: "555555",
  primaryColor: "33ab53",
  secondaryColor: "cf3b36",
  logo: "Integromat",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### vulnerabilities

The number of vulnerabilities found by NPM in your dependencies/dev dependencies. It runs the `npm audit` command in the background to determine this and adds up all of the vulnerabilities found regardless of urgency. Uses `primaryColor` when there are zero vulnerabilities.

Default:

```json
"vulnerabilities": {
  label: "Vulnerabilities",
  labelColor: "555555",
  primaryColor: "33ab53",
  secondaryColor: "cf3b36",
  logo: "Amazon Cloudwatch",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### deprecations

The number of deprecated packages in your dependencies/dev dependencies. Performs a deep search, so you may be using a package that uses a deprecated package itself as a dependency. Since NPM does not have a command to perform a deprecations search, we are expecting you to send the output of `npm install` to a `.github/data/install_log.txt` file where this badge can read the deprecations from.

Default:

```json
"deprecations": {
  label: "Deprecations",
  labelColor: "555555",
  primaryColor: "33ab53",
  secondaryColor: "cf3b36",
  logo: "Git LFS",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### nodeVersion

The current version of Node that your computer is using.

Default:

```json
"nodeVersion": {
  label: "Node Version",
  labelColor: "555555",
  primaryColor: "5c80f7",
  secondaryColor: "5c80f7",
  logo: "Node.js",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### npmVersion

The current version of NPM that your computer is using.

Default:

```json
"npmVersion": {
  label: "NPM Version",
  labelColor: "555555",
  primaryColor: "5c80f7",
  secondaryColor: "5c80f7",
  logo: "npm",
  logoColor: "ffffff",
  logoWidth: "14",
  style: "for-the-badge"
}
```

##### dependencyVersion

We allow for an arbitrary number of additional badges to be created which refer to the version of any of your dependencies or dev dependencies. The name of the badge is the name of the target dependency with `Version` appended. The default for each badge looks like this:

```json
"${name}Version": {
  "label": "${name} Version",
  "labelColor": "555555",
  "primaryColor": "5c80f7",
  "secondaryColor": "5c80f7",
  "logo": "Stackbit",
  "logoColor": "ffffff",
  "logoWidth": "14",
  "style": "for-the-badge"
}
```

If you'd like to add a badge for React (as an example) and like the default configurations, your badge config would look like this:

```json
"reactVersion": {
  label: "React Version",
  logo: "React"
}
```

## TODO:

Add a license

Create dummy repository with config options set up
