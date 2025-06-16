import { spawn } from 'child_process';
import * as process from 'node:process';
import { run } from 'node:test';
import psList from 'ps-list';

async function isObsidianRunning() {
    const processes = await psList();
    return processes.some((p) => p.name.toLowerCase().includes('obsidian'));
}

async function startObsidian() {
    const isRunning = await isObsidianRunning();
    if (isRunning) {
        return;
    }

    const cp = spawn(
        'flatpak',
        ['run', 'md.obsidian.Obsidian', '--remote-debugging-port=9222'],
        {
            detached: true,
            stdio: 'ignore',
        }
    );

    cp.unref();
}

startObsidian().catch((err) => {
    console.error('Error starting Obsidian:', err);
    process.exit(1);
});
