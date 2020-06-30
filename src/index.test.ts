import { join } from 'path';
import fse from 'fs-extra';
// TODO: Add TS support to our lint rules
// eslint-disable-next-line import/no-extraneous-dependencies
import * as exec from '@actions/exec';

const autPath = join(process.cwd(), 'aut');
const packagePath = join(autPath, 'package.json');

// Default values setup
const defaults = {
  env: {
    GITHUB_WORKSPACE: join(process.cwd(), 'aut'),
    // Mock how Github will provide `clone_url`
    GITHUB_EVENT_PATH: join(process.cwd(), 'aut', 'github-payload.json'),
    'INPUT_PACKAGE-DIRECTORY': './',
    'INPUT_TAG-FORMAT': 'v$version',
  },
  silent: true,
};

// TODO: This could be moved into a separate library for use for other action tests
/**
 * Github Actions test runner
 *
 * @param execOptions - Runner exec CLI runnerOptions
 * @param actionInputs - Action input option with it's associated value
 * @returns code, stdout, and stderr of the runner process
 */
async function runner(
  execOptions: exec.ExecOptions = {},
  actionInputs: Record<string, string> = {},
): Promise<{ code: number; stdout: string; stderr: string }> {
  const actionPath = join(__dirname, '..', 'lib', 'index.js');

  const inputs = Object.keys(actionInputs).reduce<Record<string, string>>(
    (acc, name): Record<string, string> => {
      // Transform to what Github Actions expects when retrieving an option.
      // i.e. tag-format –> INPUT_TAG-FORMAT
      const key = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
      const value = actionInputs[name];
      acc[key] = value.toString();
      return acc;
    },
    {},
  );

  let stdout = '';
  let stderr = '';

  // Override with action inputs
  const env = {
    ...execOptions.env,
    ...inputs,
  };

  const options: exec.ExecOptions = {
    ...execOptions,
    env,
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString();
      },
      stderr: (data: Buffer) => {
        stderr += data.toString();
      },
    },
  };

  let code;
  try {
    code = await exec.exec('node', [actionPath], options);
  } catch (err) {
    if (!execOptions?.silent) {
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    }
    // Throw the original error but also provide some context for additional
    // assertions
    const runnerError = Object.create(err);
    runnerError.code = 1;
    runnerError.stdout = stdout;
    runnerError.stderr = stderr;
    throw runnerError;
  }
  return { code, stdout, stderr };
}

describe('@reside-eng/verify-git-tag-action', () => {
  afterEach(async () => {
    await fse.remove(packagePath);
  });

  it('should run with default action inputs', async () => {
    await fse.copy(join(autPath, 'package-pass.json'), packagePath);
    const { code } = await runner(defaults);
    expect(code).toStrictEqual(0);
  });

  it('should fail if the package.json file can not be found', async () => {
    await expect(runner(defaults)).rejects.toThrow(
      expect.objectContaining({
        code: 1,
        stderr: expect.stringMatching(/ENOENT/),
      }),
    );
  });

  it('should fail if not version is found in package.json', async () => {
    await fse.copy(join(autPath, 'package-missing-version.json'), packagePath);
    await expect(runner(defaults)).rejects.toThrow(
      expect.objectContaining({
        code: 1,
        stderr: expect.stringMatching(/Missing "version"/),
      }),
    );
  });

  it('should fail if a tag already exists', async () => {
    await fse.copy(join(autPath, 'package-fail.json'), packagePath);
    await expect(
      runner(defaults, { 'tag-format': '$version' }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 1,
        stderr: expect.stringMatching(/Tag .* already exists/),
      }),
    );
  });

  describe('package-directory input', () => {
    it('should support a path with no slashes in path', async () => {
      const { code } = await runner(defaults, {
        'package-directory': 'nested',
      });
      expect(code).toStrictEqual(0);
    });

    it('should support a path with ./ prepended', async () => {
      const { code } = await runner(defaults, {
        'package-directory': './nested',
      });
      expect(code).toStrictEqual(0);
    });

    it('should support a trailing slash (/)', async () => {
      const { code } = await runner(defaults, {
        'package-directory': 'nested/',
      });
      expect(code).toStrictEqual(0);
    });
  });

  describe('tag-format input', () => {
    it('should fail if missing the REQUIRED_TAG_FORMAT minimal requirements', async () => {
      await fse.copy(join(autPath, 'package-pass.json'), packagePath);
      await expect(
        runner(defaults, { 'tag-format': 'missing' }),
      ).rejects.toThrow(
        expect.objectContaining({
          code: 1,
          stderr: expect.stringMatching(
            /tag-format is missing required .* pattern/,
          ),
        }),
      );
    });
  });
});
