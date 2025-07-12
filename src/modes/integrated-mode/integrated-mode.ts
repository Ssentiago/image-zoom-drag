import InteractifyPlugin from '@/core/interactify-plugin';
import { LeafID } from '@/core/types/definitions';
import { t } from '@/lang';
import DirectElementAdapter from '@/modes/integrated-mode/adapters/direct-element-adapters/direct-element-adapter';
import { LivePreviewAdapter } from '@/modes/integrated-mode/adapters/markdown-view-adapters/live-preview-adapter';
import { PreviewAdapter } from '@/modes/integrated-mode/adapters/markdown-view-adapters/preview-adapter';
import { IntegratedModeContext } from '@/modes/integrated-mode/integrated-mode-context';
import InteractifyUnit from '@/modes/integrated-mode/interactify-unit/interactify-unit';
import { TriggerType } from '@/modes/integrated-mode/interactify-unit/types/constants';

import { Component, debounce, MarkdownPostProcessorContext } from 'obsidian';

export default class IntegratedMode extends Component {
    readonly context: IntegratedModeContext;
    constructor(public readonly plugin: InteractifyPlugin) {
        super();
        this.context = new IntegratedModeContext(this);
    }

    initialize() {
        this.load();

        this.setupCommands();
        this.setupInternalEventHandlers();
        this.setupObsidianEventHandlers();
    }

    get settings() {
        return this.plugin.settings.data;
    }

    private setupCommands(): void {
        this.plugin.addCommand({
            id: 'toggle-panels-state',
            name: 'Toggle control panels visibility for all the active interactive images in current note',
            checkCallback: (checking: boolean) => {
                const units = this.plugin.state.getUnits(this.context.leafID!);

                if (checking) {
                    return (
                        (this.context.inLivePreviewMode ||
                            this.context.inPreviewMode) &&
                        this.context.active &&
                        units.some((u) => u.active)
                    );
                }
                if (!this.context.active) {
                    this.plugin.showNotice(t.commands.togglePanels.notice.noMd);
                    return;
                }

                if (!units.some((d) => d.active)) {
                    this.plugin.showNotice(
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
                this.plugin.showNotice(message);
                this.plugin.logger.debug(
                    'Called command `toggle-panels-management-state`'
                );
                return true;
            },
        });
    }

    private setupInternalEventHandlers(): void {
        this.plugin.emitter.on('unit.created', (unit: InteractifyUnit) => {
            const leafID = this.context.leafID;
            if (!leafID) {
                this.plugin.logger.warn('No active leaf found.');
                this.plugin.state.pushOrphanUnit(unit);
                this.plugin.logger.debug('orphan unit was added to state');
                return;
            }
            this.plugin.state.pushUnit(leafID, unit);
            this.plugin.logger.debug('Unit added to state', {
                leafID,
                unitName: unit.context.options.name,
            });
        });
    }

    private setupObsidianEventHandlers(): void {
        const onLeafEvent = async (
            event: 'active-leaf-change' | 'layout-change'
        ) => {
            this.context.cleanup((leafID) =>
                this.plugin.state.cleanupLeaf(leafID)
            );
            this.context.initialize((leafID) => {
                this.plugin.state.initializeLeaf(leafID);
                this.setupResizeObserver(leafID);
            });

            if (!this.settings.units.interactivity.markdown.autoDetect) {
                return;
            }

            if (!this.context.active) {
                return;
            }

            if (event === 'layout-change') {
                await this.plugin.state.cleanupUnitsOnFileChange(
                    this.context.leafID!,
                    this.context.view!.file!.stat
                );
                await this.plugin.state.cleanOrphan();
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
                this.plugin.state.hasLiveObserver(this.context.leafID!)
            );
            this.plugin.logger.debug(
                'Initialized adapter for Live Preview Mode...'
            );
        };

        this.plugin.registerMarkdownPostProcessor(
            async (
                element: HTMLElement,
                context: MarkdownPostProcessorContext
            ) => {
                this.context.initialize((leafID) =>
                    this.plugin.state.initializeLeaf(leafID)
                );

                if (!this.settings.units.interactivity.markdown.autoDetect) {
                    return;
                }

                if (this.context.active && this.context.inPreviewMode) {
                    this.plugin.logger.debug(
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

                    this.plugin.logger.debug(
                        'Initialized adapter for Preview Mode...'
                    );
                }
            }
        );

        this.plugin.registerEvent(
            this.plugin.app.workspace.on('layout-change', async () => {
                this.plugin.logger.debug(
                    'Calling withing the layout-change-event...'
                );

                await onLeafEvent('layout-change');
            })
        );
        this.plugin.registerEvent(
            this.plugin.app.workspace.on('active-leaf-change', async () => {
                this.plugin.logger.debug(
                    'Called withing the active-leaf-change event...'
                );
                await onLeafEvent('active-leaf-change');
            })
        );
    }

    setupResizeObserver(leafID: LeafID) {
        if (this.plugin.state.hasResizeObserver(leafID)) {
            return;
        }
        const debouncedApplyLayout = debounce(
            () => {
                this.plugin.state
                    .getUnits(leafID)
                    .forEach((unit) => unit.applyLayout());
            },
            50,
            true
        );

        const obs = new ResizeObserver(() => {
            debouncedApplyLayout();
        });
        obs.observe(this.context.view?.contentEl!);
        this.plugin.state.setResizeObserver(leafID, obs);
    }

    async createDirectlyIntegratedElement(
        element: SVGElement | HTMLImageElement
    ) {
        const adapter = new DirectElementAdapter(this, {
            ctime: 0,
            size: 0,
            mtime: 0,
        });

        await adapter.initialize(element);
    }
}
