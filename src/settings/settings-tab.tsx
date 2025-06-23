import { App, PluginSettingTab } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';

import DiagramZoomDragPlugin from '../core/diagram-zoom-drag-plugin';
import SettingsRoot from './components/SettingsRoot';
import { SettingsEventPayload } from './types/interfaces';

export class SettingsTab extends PluginSettingTab {
    private root: Root | undefined = undefined;

    constructor(
        public app: App,
        public plugin: DiagramZoomDragPlugin
    ) {
        super(app, plugin);
        this.containerEl.addClass('diagram-zoom-drag-settings');
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
