import { confirm, input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import prettier from 'prettier';
import semver from 'semver';

const MANIFEST_PATH = 'manifest.json';
const PACKAGE_PATH = 'package.json';
const README_PATH = 'README.md';
const CHANGELOG_PATH = 'CHANGELOG.md';
const DIST_PATH = 'dist';
const MAIN_BRANCHES = ['main', 'master'];

interface JsonFile {
    version: string;
}

function setRootFolder() {
    let current = process.cwd();
    while (true) {
        const pkg = path.join(current, 'manifest.json');
        if (fs.existsSync(pkg)) {
            process.chdir(current);
            return current;
        }

        const parent = path.dirname(current);
        if (parent === current) {
            console.log(
                chalk.red('package.json not found in any parent directories')
            );
            process.exit(1);
        }
        current = parent;
    }
}

/**
 * Checking the availability of gh CLI
 */
function checkGhCli() {
    try {
        execSync('gh --version', { stdio: 'ignore' });
    } catch (error) {
        console.error(
            chalk.red(
                'Github Cli (GH) was not found. Install it: https://cli.github.com/'
            )
        );
        process.exit(1);
    }
}

/**
 * Cleaning and building
 */
async function buildProject() {
    console.log('Cleaning and building...');

    // Clearing dist
    if (fs.existsSync(DIST_PATH)) {
        fs.rmSync(DIST_PATH, { recursive: true, force: true });
        console.log('The dist folder is cleared');
    }

    // Build
    try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log(chalk.green('The build is completed'));
    } catch (error) {
        console.error(chalk.red(`Build error: ${error}`));
        process.exit(1);
    }
}

/**
 * Getting the Repository URL
 */
function getRepoUrl(): string {
    try {
        const repoInfo = execSync('gh repo view --json url', { stdio: 'pipe' })
            .toString()
            .trim();
        const parsed = JSON.parse(repoInfo);
        return parsed.url;
    } catch (error) {
        console.error('Error getting the repo URL:', error);
        process.exit(1);
    }
}

/**
 * Extracting a changelog for a specific version
 */
function extractChangelogForVersion(version: string): string {
    try {
        const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf8');
        const lines = changelogContent.split('\n');

        const versionPattern = new RegExp(
            `^#\\s+\\[?${version.replace(/\./g, '\\.')}\\]?`
        );
        let startIndex = -1;
        let endIndex = -1;

        // Find the beginning of the section for the version
        for (let i = 0; i < lines.length; i++) {
            if (versionPattern.test(lines[i])) {
                startIndex = i + 1;
                break;
            }
        }

        if (startIndex === -1) {
            return `Changes for version ${version}`;
        }

        // Find the end of the section (next heading)
        for (let i = startIndex; i < lines.length; i++) {
            if (lines[i].startsWith('# ')) {
                endIndex = i;
                break;
            }
        }

        const sectionLines =
            endIndex === -1
                ? lines.slice(startIndex)
                : lines.slice(startIndex, endIndex);

        return sectionLines.join('\n').trim();
    } catch (error) {
        console.error('Error reading changelog:', error);
        return `Changes for version ${version}`;
    }
}

/**
 * Creating a GitHub release
 */
async function createGitHubRelease(
    version: string,
    previousVersion: string,
    repoUrl: string
) {
    console.log('Creating a GitHub release...');

    // Get a changelog for the version
    const changelogSection = extractChangelogForVersion(version);

    // Create a release body
    const fullChangelogUrl = `${repoUrl}/compare/${previousVersion}...${version}`;
    const releaseBody = `${changelogSection}\n\n**Full Changelog**: ${fullChangelogUrl}`;

    // Get all files from dist
    const distFiles = fs
        .readdirSync(DIST_PATH)
        .map((file) => path.join(DIST_PATH, file))
        .join(' ');

    try {
        const releaseCommand = `gh release create ${version} ${distFiles} --title "Release ${version}" --notes "${releaseBody.replace(/"/g, '\\"')}"`;
        execSync(releaseCommand, { stdio: 'inherit' });
        console.log(chalk.green(`Release ${version} created and published`));
    } catch (error) {
        console.error('Release creation error:', error);
        process.exit(1);
    }
}

async function changeReleaseInJson(jsonPath: string, release: string) {
    try {
        const json = fs.readFileSync(jsonPath, 'utf8');
        const data: JsonFile = JSON.parse(json);
        data.version = release;

        const formatted = await prettier.format(JSON.stringify(data), {
            parser: 'json',
        });

        fs.writeFileSync(jsonPath, formatted);
    } catch (err: any) {
        console.error('Error reading JSON file:', err);
        process.exit(1);
    }
}

function checkChangelogSection(version: string): boolean {
    try {
        const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf8');
        const versionPattern = new RegExp(
            `^#\\s+\\[?${version.replace(/\./g, '\\.')}\\]?\\s*$`,
            'm'
        );
        return versionPattern.test(changelogContent);
    } catch (err) {
        console.error('Error reading changelog:', err);
        return false;
    }
}

/**
 * Get operations via gh
 */
async function performGitOperations(version: string, branch: string) {
    try {
        execSync('git reset', { stdio: 'ignore' });
        execSync(`git add ${PACKAGE_PATH} ${MANIFEST_PATH}`, {
            stdio: 'ignore',
        });
        execSync(`git commit -m 'chore: update plugin version to ${version}'`, {
            stdio: 'ignore',
        });
        execSync(`git push origin ${branch}`, { stdio: 'ignore' });
        console.log(chalk.green('The changes are running in the repo'));
    } catch (error) {
        console.error('Error of git operations:', error);
        process.exit(1);
    }
}

async function getNewVersion(
    previousVersions: string[],
    currentVersion: string,
    isFirstEnter: boolean
) {
    const answer = await input({
        message: 'Enter new version number or press Enter to exit: ',
        required: false,
        validate: (value) => {
            if (value === '') {
                return true;
            }
            if (!semver.valid(value)) {
                return 'Invalid version format. Please try again. It should be semantic versioning (e.g., 1.2.3)';
            }
            if (previousVersions.includes(value)) {
                return 'Version already exists. Please try again.';
            }
            if (!isFirstEnter && semver.lt(value, currentVersion)) {
                return `Version must be greater than current version. Current version is: ${currentVersion}. Please try again.`;
            }
            return true;
        },
    });

    if (!answer.trim()) {
        console.log('See you later!');
        process.exit(0);
    }

    return answer;
}

async function versionMenu(
    previousVersions: string[],
    currentVersion: string
): Promise<string> {
    process.on('SIGINT', () => {
        console.log('\nProcess terminated. Exiting gracefully...');
        process.exit(0);
    });

    while (true) {
        const [major, minor, patch] = currentVersion.split('.').map(Number);

        const answer = await select({
            message: `Update current version ${currentVersion} or perform other actions:`,
            choices: [
                {
                    name: `Patch (bug fixes): ${major}.${minor}.${patch + 1}`,
                    value: '1',
                },
                {
                    name: `Minor (new functionality): ${major}.${minor + 1}.0`,
                    value: '2',
                },
                {
                    name: `Major (significant changes): ${major + 1}.0.0`,
                    value: '3',
                },
                { name: 'Manual update (enter version)', value: '4' },
                { name: 'View previous versions', value: '5' },
                { name: 'Exit', value: '6' },
            ],
        });

        if (answer === '1') {
            return `${major}.${minor}.${patch + 1}`;
        } else if (answer === '2') {
            return `${major}.${minor + 1}.0`;
        } else if (answer === '3') {
            return `${major + 1}.0.0`;
        } else if (answer === '4') {
            return getNewVersion(previousVersions, currentVersion, false);
        } else if (answer === '5') {
            console.log('Previous versions:');
            console.log(`- ${previousVersions.join('\n- ')}`);
            await input({
                message: 'Press Enter to go back to the menu...',
                required: false,
                transformer: () => '',
            });
        } else if (answer === '6') {
            console.log('See you later!');
            process.exit(0);
        }
    }
}

/**
 * Getting versions via gh
 */
async function getVersion(): Promise<{
    version: string;
    previousVersion: string;
}> {
    try {
        const releasesOutput = execSync('gh release list --limit 100', {
            stdio: 'pipe',
        })
            .toString()
            .trim();

        const releases = releasesOutput
            ? releasesOutput.split('\n').map((line) => line.split('\t')[0])
            : [];

        const currentVersion = releases[0];

        if (releases.length === 0) {
            const version = await getNewVersion(releases, currentVersion, true);
            return { version, previousVersion: '' };
        }

        const version = await versionMenu(releases, currentVersion);
        return { version, previousVersion: currentVersion };
    } catch (error) {
        // Fallback on git tags if gh does not work
        const tagOutput = execSync('git tag', { stdio: 'pipe' })
            .toString()
            .trim();
        const tags = tagOutput ? tagOutput.split('\n') : [];
        const currentVersion = tags[tags.length - 1];

        if (tags.length === 0) {
            const version = await getNewVersion(tags, currentVersion, true);
            return { version, previousVersion: '' };
        }

        const version = await versionMenu(tags, currentVersion);
        return { version, previousVersion: currentVersion };
    }
}

export async function release() {
    // Checking the gh CLI
    checkGhCli();

    while (true) {
        const { version: RELEASE_VERSION, previousVersion } =
            await getVersion();

        const confirmation = await select({
            message: `You entered version ${RELEASE_VERSION}. Continue?`,
            choices: [
                { name: 'Yes', value: 'y' },
                { name: 'No', value: 'n' },
                { name: 'Retry', value: 'r' },
            ],
        });

        switch (confirmation) {
            case 'y':
                break;
            case 'n':
                console.log('See you later!');
                process.exit(0);
                break;
            case 'r':
                continue;
        }

        const hasUpdatedChangelog = checkChangelogSection(RELEASE_VERSION);

        if (!hasUpdatedChangelog) {
            console.log(
                chalk.yellow(
                    `Changelog section for ${RELEASE_VERSION} not found. Please update the changelog.`
                )
            );
            return;
        }

        await changeReleaseInJson(PACKAGE_PATH, RELEASE_VERSION);
        await changeReleaseInJson(MANIFEST_PATH, RELEASE_VERSION);

        console.log(
            chalk.green(
                `Version updated to ${RELEASE_VERSION} in package.json and manifest.json`
            )
        );

        const confirmContinue = await confirm({
            message: 'Continue with git operations and release?',
            default: true,
        });

        if (!confirmContinue) {
            console.log('See you later!');
            process.exit(0);
        }

        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
            stdio: 'pipe',
        })
            .toString()
            .trim();

        console.log(`Working with a branch: ${currentBranch}`);

        if (!MAIN_BRANCHES.includes(currentBranch)) {
            console.log(
                chalk.red(
                    `Expected one of branches: ${MAIN_BRANCHES.join(', ')}, got branch: ${currentBranch}`
                )
            );
            process.exit(1);
        }

        await performGitOperations(RELEASE_VERSION, currentBranch);

        await buildProject();

        const repoUrl = getRepoUrl();

        await createGitHubRelease(RELEASE_VERSION, previousVersion, repoUrl);

        console.log(
            chalk.green(
                `Release ${RELEASE_VERSION} has been successfully created and published!`
            )
        );

        break;
    }
}

(async () => {
    setRootFolder();
    await release();
})();
