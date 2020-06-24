// import core from '@actions/core';
// import github from '@actions/github';
// import remoteTags from 'remote-git-tags';
const core = require('@actions/core');
const remoteTags = require('remote-git-tags');

// - name: Verify Available Release Tag
// if: github.base_ref == 'master'
// env:
//   CLONE_URL: ${{ github.event.repository.clone_url }}
// run: |
//   # Create tag name unique to the app – i.e. v0.7.0-app-name
//   packageJson=packages/${{ matrix.app }}/package.json
//   tagName=v$(cat $packageJson | jq .version -r)-${{ matrix.app }}

//   echo "Checking $CLONE_URL for any tags matching $tagName"
//   if git ls-remote --tags $CLONE_URL | grep -E "refs/tags/${tagName}$"; then
//     echo Error: Tag \"$tagName\" already exists in remote origin. A new version in \"$packageJson\" must be set before releasing to production.
//     exit 1
//   fi

//   echo Tag \"$tagName\" is available to use

async function run(): Promise<void> {
  try {
    const tags = await remoteTags(
      'https://github.com/reside-eng/core-app-legacy.git',
    );

    console.log('tags:', tags);
    console.log('contains tag:', tags.has('v0.7.22'));

    const tagPattern = '$version-cider';
    const packageJsonPath = './packages/cider/package.json';
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { version } = require(packageJsonPath);
    const tagName = tagPattern.replace('$version', version);
    if (!tags.has(tagName)) {
      core.setFailed(`Tag "${tagName} already exists in remote origin.`);
    }

    core.info(`Tag "${tagName} is available to use.`);
  } catch (err) {
    core.setFailed(`Verify Git Tag Action failed with error ${err}`);
  }
}

run();
