import InteractifyPlugin from '@/core/interactify-plugin';

import { moment } from 'obsidian';

export default class UserState {
    isFirstLaunch = false;
    shouldShowTips = false;

    constructor(private readonly plugin: InteractifyPlugin) {}

    async initialize(): Promise<void> {
        this.isFirstLaunch = await this.getIsFirstLaunch();
        this.shouldShowTips = this.getShouldShowTips();
    }

    private async getIsFirstLaunch(): Promise<boolean> {
        const currentCtime = await this.getPluginCtime();

        const savedCtime =
            this.plugin.app.loadLocalStorage('interactify-ctime');

        if (typeof savedCtime !== 'string') {
            this.plugin.app.saveLocalStorage('interactify-ctime', currentCtime);
            return true;
        }

        const isEqual = savedCtime === currentCtime;

        if (!isEqual) {
            this.plugin.app.saveLocalStorage('interactify-ctime', currentCtime);
            return true;
        }
        return false;
    }

    getShouldShowTips(): boolean {
        const shouldShowTips = this.plugin.app.loadLocalStorage(
            'interactify-should-show-tips'
        );
        if (typeof shouldShowTips === 'string') {
            return false;
        }

        const savedCtime =
            this.plugin.app.loadLocalStorage('interactify-ctime');
        if (typeof savedCtime !== 'string') {
            return true;
        }

        const installDate = moment(Number(savedCtime));
        const hasWeekSpent = moment().diff(installDate, 'weeks') >= 1;

        if (hasWeekSpent) {
            this.markTipsViewed();
        }
        return !hasWeekSpent;
    }

    markTipsViewed(): void {
        this.plugin.app.saveLocalStorage(
            'interactify-should-show-tips',
            'viewed'
        );
    }

    private async getPluginCtime(): Promise<string> {
        const pluginDir = this.plugin.manifest.dir;
        if (!pluginDir) {
            throw new Error('Plugin directory not found in manifest');
        }
        const stat = await this.plugin.app.vault.adapter.stat(pluginDir);

        return (stat?.ctime ?? 0).toString();
    }
}
