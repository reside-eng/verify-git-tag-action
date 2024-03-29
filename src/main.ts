import { join } from 'path';
import { readJson } from 'fs-extra';
import * as core from '@actions/core';
import * as github from '@actions/github';
import remoteTags from 'remote-git-tags';

const REQUIRED_TAG_FORMAT = '$version';

/**
 * Gets the version from a package.json file.
 *
 * @returns version of the code
 */
async function getVersion(): Promise<string> {
  const packagePath = join(
    process.env.GITHUB_WORKSPACE || '',
    core.getInput('package-directory'),
    'package.json',
  );

  core.debug(`Reading ${packagePath}...`);

  const { version } = await readJson(packagePath);
  if (!version) {
    throw new Error(`Missing "version" in ${packagePath}`);
  }

  core.info(`Found version ${version} in ${packagePath}`);
  return version;
}

/**
 * Logs an error and fails the Github Action
 *
 * @param err Any possible errors
 */
function handleError(err: Error): void {
  console.error(err);
  core.setFailed(err.message);
}

/**
 * Action run pipeline
 */
async function pipeline() {
  // eslint-disable-next-line camelcase
  const cloneUrl = github.context.payload.repository?.clone_url;
  const tagFormat = core.getInput('tag-format');

  if (!tagFormat.includes(REQUIRED_TAG_FORMAT)) {
    console.log('ERROR!');
    throw new Error(
      `tag-format is missing required "${REQUIRED_TAG_FORMAT}" pattern`,
    );
  }

  const version = await getVersion();
  const tags = await remoteTags(cloneUrl);
  const tagName = tagFormat.replace('$version', version);

  if (core.isDebug()) {
    console.log('Available remote tags:\n', tags.keys());
  }

  if (tags.has(tagName)) {
    throw new Error(`Tag "${tagName}" already exists in ${cloneUrl}.`);
  }

  core.info(`Tag "${tagName}" is available to use.`);
}

/**
 * Main function to execute the Github Action
 */
export async function run(): Promise<void> {
  process.on('unhandledRejection', handleError);
  await pipeline().catch(handleError);
}
