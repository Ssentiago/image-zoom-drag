import { App, PluginSettingTab } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';

import InteractifyPlugin from '../core/interactify-plugin';
import { SettingsEventPayload } from './types/interfaces';
import SettingsRoot from './ui/SettingsRoot';

export class SettingsTab extends PluginSettingTab {
    private root: Root | undefined = undefined;

    constructor(
        public app: App,
        public plugin: InteractifyPlugin
    ) {
        super(app, plugin);
        this.containerEl.addClass('interactify-settings');
    }

    display(): void {
        this.plugin.settings.eventBus.on(
            '**',
            (payload: SettingsEventPayload) => {
                this.plugin.eventBus.emit(payload.eventName, payload);
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

    /**
     * Hides the settings tab.
     *
     * This method unmounts the React root component and clears the container element.
     */
    hide(): void {
        this.plugin.settings.eventBus.removeAllListeners();

        this.root?.unmount();
        this.containerEl.empty();
    }
}
