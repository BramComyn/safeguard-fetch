# Safeguard Fetch

Wrapper around ``insert chosen module`` for ensuring a less vulnerable resource request enviroment for
linked-data query engines.

## Testing

The repo uses `jest` for testing.
Tests are expected in the following format: `/test/(unit|integration)/.*\.test\.ts$`,
so your tests need to end on `.test.ts` and should be in (a subfolder of) `test/unit` or `test/integration`.
This can be changed in `jest.config.js`.

Note that the `test` folder has its own tsconfig.json.
This is necessary to make sure those files are not built but are covered by the linter.

Coverage will be generated when testing,
but no coverage restrictions are set.
If you want to ensure 100% code coverage,
add the following to your `jest.config.js`:

```text
coverageThreshold: {
  './src': {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  }
```

## Linting

Linting is done using [opinionated-eslint-config](https://github.com/joachimvh/opinionated-eslint-config).
See the documentation there if you want to make changes.

Besides that, there is also markdown linting which is defined by the settings in `.markdownlint-cli2.cjs`.
The `.github` folder has its own settings for markdown linting to prevent issues with the templates discussed below.

## Committing

Before committing, the build, lint, and test scripts will be run.

Commit messages are expected to be in the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) format.
Unfortunately this can only be checked automatically after the pre-commit checks,
so make sure you have it right the first time.
The rules for this are specified in `commitlint.config.js`.

## Continuous Integration

`.github/workflows/test.yml` contains a GitHub CI file that will trigger linting and testing for PRs and new commits.

## Releasing

To release a new version, run `npm run release -- -r major/minor/patch`,
with `major`, `minor`, or `patch` chosen based on [Semantic Versioning](https://semver.org/).
This will create, or update, `CHANGELOG.md` based on the commits since the previous release,
and tag the release.
In the case of a major release,
it will also update the context entries of all Components.js configurations in the `config` folder,
and update the necessary Components.js fields in the `package.json`.
After this you still have to manually push the commit and tag to GitHub.

The format of the changelog is defined in `.versionrc.json`.

You can do an alpha release using, for example, `npm run release -- -r major --prerelease alpha`.

You can do a dry-run to see the results by adding the `--dry-run` option.

If you want to update the contexts of Components.js configurations in other folders than `config`,
you will need to add those in `scripts/upgradeConfig.ts`.

## GitHub

Templates are included for PRs and new issues.

If you want to add issue templates, this can be done in `.github/ISSUE_TEMPLATE`.

If you want users to only be able to use those templates,
create `.github/ISSUE_TEMPLATE/config.yml` and add `blank_issues_enabled: false`.

If you enable discussions, you can direct uses there when creating a new issue
by adding the following to the same `.github/ISSUE_TEMPLATE/config.yml`:

```yaml
contact_links:
  - name: ❓ Question
    url: https://github.com/$MY_ORG/$MY_REPO/discussions/new/choose
    about: A question or discussion about the project
```

## Dependabot

A Dependabot config is included in `.github/dependabot.yml`
to get notified when new major releases of libraries get released.
You still have to manually add Dependabot to your repository
as described [here](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide).
If you also want to be notified of minor/patch releases you will have to update the configuration.

## Removing Components.js

This template is made for repositories that want to support Components.js,
but in case you do not want to do that, this can be removed with the following steps:

* In `package.json`
    * Remove all fields starting with `lsd:`.
    * Change the `build` script to only perform the steps of `build:ts` and remove `build:components`.
    * Remove the `componentsjs-generator` dependency.
    * In the `commit-and-tag-version` settings, remove the `postbump` step.
* Remove the `config/dummy.json`, `scripts/upgradeConfig.ts`, and `.componentsignore` files.
