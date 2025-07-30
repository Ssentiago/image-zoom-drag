import { App, PluginSettingTab } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';

import IzdPlugin from '../core/izd-plugin';
import { SettingsEventPayload } from './types/interfaces';
import SettingsRoot from './ui/SettingsRoot';

export class SettingsTab extends PluginSettingTab {
    private root: Root | undefined = undefined;

    constructor(
        public app: App,
        public plugin: IzdPlugin
    ) {
        super(app, plugin);
        this.containerEl.addClass('izd-settings');
    }

    display(): void {
        this.plugin.settings.emitter.on(
            '**',
            (payload: SettingsEventPayload) => {
                this.plugin.emitter.emit(payload.eventName, payload);
            }
        );

        this.root = createRoot(this.containerEl);
        this.root.render(
            <SettingsRoot
                app={this.app}
                plugin={this.plugin}
            />
        );
    }

    hide(): void {
        this.plugin.settings.emitter.removeAllListeners();

        this.root?.unmount();
        this.containerEl.empty();
    }
}
