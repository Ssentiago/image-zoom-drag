import Diagram from 'diagram/diagram';
import EventEmitter2 from 'eventemitter2';
import {
    MarkdownPostProcessorContext,
    MarkdownView,
    Notice,
    Plugin,
} from 'obsidian';

import { MarkdownLivePreviewAdapter } from '../adapters/markdown-live-preview-adapter';
import { MarkdownPreviewAdapter } from '../adapters/markdown-preview-adapter';
import { TriggerType } from '../diagram/types/constants';
import Logger from '../logger/logger';
import SettingsManager from '../settings/settings-manager';
import { SettingsTab } from '../settings/settings-tab';
import { PluginContext } from './plugin-context';
import PluginStateChecker from './plugin-state-checker';
import State from './state';

export default class DiagramZoomDragPlugin extends Plugin {
    context!: PluginContext;
    state!: State;
    settings!: SettingsManager;
    pluginStateChecker!: PluginStateChecker;
    diagram!: Diagram;
    logger!: Logger;
    eventBus!: EventEmitter2;

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

    /**
     * Unloads the plugin and cleans up resources.
     *
     * This function is called automatically by Obsidian when the plugin is unloaded.
     * It unsubscribes all event listeners and cleans up any other resources that the plugin may have allocated.
     *
     * @returns {void} Void.
     */
    onunload(): void {
        this.logger.debug('Plugin unloading...');
        this.state.clear();
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
    /**
     * Initializes the user interface for the plugin.
     *
     * this function initializes the diagram manager and adds a command to toggle the control panel visibility of the current active diagram.
     *
     * @returns A promise that resolves once the user interface has been successfully initialized.
     */
    async initializeUI(): Promise<void> {
        this.setupCommands();
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
        this.eventBus.on('diagram.created', (diagram: Diagram) => {
            const leafID = this.context.leafID;
            if (!leafID) {
                this.logger.error('No active leaf found.');
                return;
            }
            this.state.pushDiagram(leafID, diagram);
            this.logger.debug('Diagram added to state', {
                leafID,
                diagramName: diagram.context.diagramData.name,
            });
        });
    }

    /**
     * Sets up Obsidian workspace event handlers for diagram functionality.
     * Handles view initialization, mode switching, and cleanup across different markdown view states.
     */
    private setupObsidianEventHandlers(): void {
        this.app.workspace.onLayoutReady(() => {
            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            const wasUserOnMarkdownViewBeforePluginStart = view !== null;
            if (wasUserOnMarkdownViewBeforePluginStart) {
                this.showNotice(
                    'Diagram Zoom Drag: Please reload this view to enable diagram functionality.'
                );
            }
        });

        this.registerMarkdownPostProcessor(
            async (
                element: HTMLElement,
                context: MarkdownPostProcessorContext
            ) => {
                this.context.initialize((leafID) =>
                    this.state.initializeLeaf(leafID)
                );

                if (this.context.active && this.context.inPreviewMode) {
                    this.logger.debug(
                        'Calling withing the Markdown PostProcessor...'
                    );
                    const adapter = new MarkdownPreviewAdapter(this, {
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
                this.context.cleanup((leafID) =>
                    this.state.cleanupLeaf(leafID)
                );

                this.context.initialize((leafID) =>
                    this.state.initializeLeaf(leafID)
                );

                if (!this.context.active) {
                    return;
                }

                await this.state.cleanupDiagramsOnFileChange(
                    this.context.leafID!,
                    this.context.view!.file!.stat
                );

                if (this.context.inLivePreviewMode) {
                    this.logger.debug(
                        'Calling withing the layout-change-event...'
                    );
                    const adapter = new MarkdownLivePreviewAdapter(this, {
                        ...this.context.view!.file!.stat,
                    });
                    await adapter.initialize(
                        this.context.leafID!,
                        this.context.view!.containerEl,
                        undefined,
                        this.state.hasObserver(this.context.leafID!)
                    );
                    this.logger.debug(
                        'Initialized adapter for Live Preview Mode...'
                    );
                }
            })
        );
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', async () => {
                this.context.cleanup((leafID) =>
                    this.state.cleanupLeaf(leafID)
                );

                this.context.initialize((leafID) =>
                    this.state.initializeLeaf(leafID)
                );

                if (this.context.active && this.context.inLivePreviewMode) {
                    this.logger.debug(
                        'Called withing the active-leaf-change event...'
                    );
                    const adapter = new MarkdownLivePreviewAdapter(this, {
                        ...this.context.view!.file!.stat,
                    });
                    await adapter.initialize(
                        this.context.leafID!,
                        this.context.view!.containerEl,
                        undefined,
                        this.state.hasObserver(this.context.leafID!)
                    );
                    this.logger.debug(
                        'Initialized adapter for Live Preview Mode...'
                    );
                }
            })
        );
    }

    /**
     * Sets up the commands for the plugin.
     *
     * This function registers the command 'diagram-zoom-drag-toggle-panels-management-state'
     * which toggles the visibility of control panels for all diagrams in the current note.
     * The command is only available when a Markdown view is active and either in live preview
     * or preview mode. If any control panel is visible, the command hides them; otherwise, it
     * shows them. A notice is displayed indicating whether the control panels were shown or hidden.
     *
     * @returns void
     */
    private setupCommands(): void {
        this.addCommand({
            id: 'diagram-zoom-drag-toggle-panels-management-state',
            name: 'Toggle control panels visibility for all diagrams in current note',
            checkCallback: (checking: boolean) => {
                if (checking) {
                    return (
                        (this.context.inLivePreviewMode ||
                            this.context.inPreviewMode) &&
                        this.context.active
                    );
                }
                if (!this.context.active) {
                    this.showNotice(
                        'This command can only be used when a Markdown view is open.'
                    );
                    return;
                }
                const diagrams = this.state.getDiagrams(this.context.leafID!);

                const anyVisible = diagrams.some(
                    (diagram) => diagram.controlPanel.hasVisiblePanels
                );

                diagrams.forEach((diagram) =>
                    anyVisible
                        ? diagram.controlPanel.hide(TriggerType.FORCE)
                        : diagram.controlPanel.show(TriggerType.FORCE)
                );
                const message = anyVisible
                    ? 'Control panels hidden'
                    : 'Control panels shown';
                this.showNotice(message);
                this.logger.debug(
                    'Called command `diagram-zoom-drag-toggle-panels-management-state`'
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
