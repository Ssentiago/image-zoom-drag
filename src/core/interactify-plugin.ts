import { t } from '@/lang';

import EventEmitter2 from 'eventemitter2';
import { MarkdownPostProcessorContext, Notice, Plugin } from 'obsidian';

import { LivePreviewAdapter } from '../adapters/markdown-view-adapters/live-preview-adapter';
import { PreviewAdapter } from '../adapters/markdown-view-adapters/preview-adapter';
import InteractifyUnit from '../interactify-unit/interactify-unit';
import { TriggerType } from '../interactify-unit/types/constants';
import Logger from '../logger/logger';
import PickerMode from '../modes/picker-mode/picker-mode';
import SettingsManager from '../settings/settings-manager';
import { SettingsTab } from '../settings/settings-tab';
import { PluginContext } from './plugin-context';
import PluginStateChecker from './plugin-state-checker';
import State from './state';

export default class InteractifyPlugin extends Plugin {
    context!: PluginContext;
    state!: State;
    settings!: SettingsManager;
    pluginStateChecker!: PluginStateChecker;
    logger!: Logger;
    eventBus!: EventEmitter2;
    private pickerMode!: PickerMode;

    /**
     * Initializes the plugin when it is loaded.
     *
     * This function is called automatically when the plugin is loaded by Obsidian.
     * It initializes the plugin by calling `initializePlugin`.
     *
     * @returns A promise that resolves when the plugin has been fully initialized.
     */
    async onload(): Promise<void> {
        if (process.env.NODE_ENV === 'development') {
            (window as any).plugin = this;
        }
        await this.initializePlugin();
        this.logger.info('Plugin loaded successfully');
    }

    async onunload(): Promise<void> {
        this.logger.debug('Plugin unloading...');
        await this.state.clear();
        this.eventBus.removeAllListeners();
        this.logger.info('Plugin unloaded successfully');
    }

    /**
     * Initializes the plugin.
     *
     * This function initializes the plugin's core components, event system, and utilities.
     * It is called when the plugin is loading.
     *
     * @returns A promise that resolves when the plugin has been successfully initialized.
     */
    async initializePlugin(): Promise<void> {
        await this.initializeCore();
        await this.initializeUtils();
        await this.initializeEventSystem();
        await this.initializeUI();

        this.logger.info('Plugin initialized successfully.');
    }
    /**
     * Initializes the plugin's core components.
     *
     * This function initializes the plugin's settings manager and adds a settings tab to the Obsidian settings panel.
     *
     * @returns A promise that resolves when the plugin's core components have been successfully initialized.
     */
    async initializeCore(): Promise<void> {
        this.settings = new SettingsManager(this);
        await this.settings.loadSettings();

        this.logger = new Logger(this);
        await this.logger.init();

        this.context = new PluginContext(this);
        this.state = new State(this);

        this.addSettingTab(new SettingsTab(this.app, this));

        this.logger.debug('Core initialized');
    }
    /**
     * Asynchronously initializes the event system for handling events in the plugin.
     * This function sets up the EventPublisher and EventObserver instances, and registers event handlers for 'layout-change' and 'active-leaf-change' events.
     *
     * @returns A promise that resolves once the event system has been successfully initialized.
     */
    async initializeEventSystem(): Promise<void> {
        this.eventBus = new EventEmitter2({
            wildcard: true,
            delimiter: '.',
        });

        this.setupInternalEventHandlers();

        this.setupObsidianEventHandlers();

        this.logger.debug('Event system initialized');
    }

    async initializeUI(): Promise<void> {
        this.setupCommands();
        this.pickerMode = new PickerMode(this);
        this.addChild(this.pickerMode);
        this.logger.debug('UI initialized');
    }
    /**
     * Initializes the plugin's utility classes.
     *
     * This function initializes the PluginStateChecker, which is responsible for
     * checking if the plugin is being opened for the first time
     *
     * @returns A promise that resolves when the plugin's utilities have been
     *          successfully initialized.
     */
    async initializeUtils(): Promise<void> {
        this.pluginStateChecker = new PluginStateChecker(this);
        this.logger.debug('Utils initialized');
    }

    private setupInternalEventHandlers(): void {
        this.eventBus.on('unit.created', (unit: InteractifyUnit) => {
            const leafID = this.context.leafID;
            if (!leafID) {
                this.logger.warn('No active leaf found.');
                this.state.pushOrphanUnit(unit);
                this.logger.debug('orphan unit was added to state');
                return;
            }
            this.state.pushUnit(leafID, unit);
            this.logger.debug('Unit added to state', {
                leafID,
                unitName: unit.context.options.name,
            });
        });
    }

    private setupObsidianEventHandlers(): void {
        const onLeafEvent = async (
            event: 'active-leaf-change' | 'layout-change'
        ) => {
            this.context.cleanup((leafID) => this.state.cleanupLeaf(leafID));
            this.context.initialize((leafID) =>
                this.state.initializeLeaf(leafID)
            );

            if (!this.settings.data.units.interactivity.markdown.autoDetect) {
                return;
            }

            if (!this.context.active) {
                return;
            }

            if (event === 'layout-change') {
                await this.state.cleanupUnitsOnFileChange(
                    this.context.leafID!,
                    this.context.view!.file!.stat
                );
                await this.state.cleanOrphan();
            }

            if (!this.context.inLivePreviewMode) {
                return;
            }

            const adapter = new LivePreviewAdapter(this, {
                ...this.context.view!.file!.stat,
            });
            const sourceContainer = this.context.view!.contentEl.querySelector(
                '.markdown-source-view'
            ) as HTMLElement;

            await adapter.initialize(
                this.context.leafID!,
                sourceContainer,
                this.state.hasObserver(this.context.leafID!)
            );
            this.logger.debug('Initialized adapter for Live Preview Mode...');
        };

        this.registerMarkdownPostProcessor(
            async (
                element: HTMLElement,
                context: MarkdownPostProcessorContext
            ) => {
                this.context.initialize((leafID) =>
                    this.state.initializeLeaf(leafID)
                );

                if (
                    !this.settings.data.units.interactivity.markdown.autoDetect
                ) {
                    return;
                }

                if (this.context.active && this.context.inPreviewMode) {
                    this.logger.debug(
                        'Calling withing the Markdown PostProcessor...'
                    );
                    const adapter = new PreviewAdapter(this, {
                        ...this.context.view!.file!.stat,
                    });

                    await adapter.initialize(
                        this.context.leafID!,
                        element,
                        context
                    );

                    this.logger.debug(
                        'Initialized adapter for Preview Mode...'
                    );
                }
            }
        );

        this.registerEvent(
            this.app.workspace.on('layout-change', async () => {
                this.logger.debug('Calling withing the layout-change-event...');

                await onLeafEvent('layout-change');
            })
        );
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', async () => {
                this.logger.debug(
                    'Called withing the active-leaf-change event...'
                );
                await onLeafEvent('active-leaf-change');
            })
        );
    }

    private setupCommands(): void {
        this.addCommand({
            id: 'toggle-panels-state',
            name: 'Toggle control panels visibility for all the active interactive images in current note',
            checkCallback: (checking: boolean) => {
                const units = this.state.getUnits(this.context.leafID!);

                if (checking) {
                    return (
                        (this.context.inLivePreviewMode ||
                            this.context.inPreviewMode) &&
                        this.context.active &&
                        units.some((u) => u.active)
                    );
                }
                if (!this.context.active) {
                    this.showNotice(t.commands.togglePanels.notice.noMd);
                    return;
                }

                if (!units.some((d) => d.active)) {
                    this.showNotice(
                        t.commands.togglePanels.notice.noActiveImages
                    );
                    return;
                }

                const filteredU = units.filter((d) => d.active);

                const anyVisible = filteredU.some(
                    (u) => u.controlPanel.hasVisiblePanels
                );

                filteredU.forEach((u) =>
                    anyVisible
                        ? u.controlPanel.hide(TriggerType.FORCE)
                        : u.controlPanel.show(TriggerType.FORCE)
                );
                const message = anyVisible
                    ? t.commands.togglePanels.notice.hidden
                    : t.commands.togglePanels.notice.shown;
                this.showNotice(message);
                this.logger.debug(
                    'Called command `toggle-panels-management-state`'
                );
                return true;
            },
        });
    }

    /**
     * Displays a notice with the provided message for a specified duration.
     *
     * @param message - The message to display in the notice.
     * @param duration - The duration in milliseconds for which the notice should be displayed. Defaults to undefined.
     * @returns void
     */
    showNotice(message: string, duration?: number): void {
        new Notice(message, duration);
    }
}
