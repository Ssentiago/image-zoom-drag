import DiagramZoomDragPlugin from '../core/diagram-zoom-drag-plugin';
import { State } from './state/state';
import { ControlPanel } from './control-panel/control-panel';
import Events from './events/events';
import { DiagramActions } from './actions/diagram-actions';
import { ContextMenu } from './context-menu/context-menu';
import { MarkdownPostProcessorContext } from 'obsidian';
import { PanelsData } from './state/typing/interfaces';
import { AdapterFactory } from './adapters/adapter-factory';

export class Diagram {
    readonly state: State;
    readonly controlPanel: ControlPanel;
    readonly events: Events;
    readonly actions: DiagramActions;
    readonly contextMenu: ContextMenu;

    activeContainer: HTMLElement | undefined = undefined;

    dx!: number;
    dy!: number;
    scale!: number;
    nativeTouchEventsEnabled!: boolean;
    source!: string;
    panelsData!: PanelsData;
    livePreviewObserver!: MutationObserver | undefined;
    size!: {
        expanded: { width: number; height: number };
        folded: { width: number; height: number };
    };

    constructor(public plugin: DiagramZoomDragPlugin) {
        this.state = new State(this);
        this.actions = new DiagramActions(this);
        this.events = new Events(this);
        this.controlPanel = new ControlPanel(this);
        this.contextMenu = new ContextMenu(this);
    }

    /**
     * Generates a compound CSS selector that matches all currently enabled diagrams.
     *
     * This getter constructs a comma-separated list of selectors for each diagram
     * that is enabled in the plugin's settings. The resulting string can be used
     * to apply styles or query all enabled diagram elements at once.
     *
     * @returns {string} A compound CSS selector string.
     */
    get compoundSelector(): string {
        const diagrams = this.plugin.settings.supported_diagrams;
        return diagrams.reduce<string>((acc, diagram) => {
            if (diagram.on) {
                return acc ? `${acc}, ${diagram.selector}` : diagram.selector;
            }
            return acc;
        }, '');
    }

    async initialize(
        element: HTMLElement,
        context: MarkdownPostProcessorContext
    ): Promise<void>;

    async initialize(element: HTMLElement): Promise<void>;

    /**
     * Initializes the diagram based on the provided element and context.
     *
     * This method determines the rendering mode by checking the presence of a context.
     * If a context is provided, it initializes the diagram in preview mode by invoking
     * the `initializePreview` method. Otherwise, it initializes in live preview mode
     * by calling `initializeLivePreview`.
     *
     * @param {HTMLElement} element - The HTML element representing the diagram container.
     * @param {MarkdownPostProcessorContext} [context] - Optional context indicating
     *        that rendering is in preview mode. If not provided, live preview mode is assumed.
     * @returns {Promise<void>} A promise that resolves once initialization is complete.
     */
    async initialize(
        element: HTMLElement,
        context?: MarkdownPostProcessorContext
    ): Promise<void> {
        const adapter = AdapterFactory.getSuitableAdapter(this);
        if (adapter) {
            await adapter.initialize(element, context);
        }
    }

    updateDiagramSizeBasedOnStatus(el: HTMLElement): void {
        const isFolded = el.hasClass('folded');
        const size = isFolded ? this.size.folded : this.size.expanded;
        const setting = isFolded ? this.plugin.settings.diagramFolded : this.plugin.settings.diagramExpanded;

        el.style.height = `${size.height}${this.plugin.settings.preserveDiagramOriginalSize ? 'px' : setting.heightUnit}`;
        el.style.width = `${size.width}${this.plugin.settings.preserveDiagramOriginalSize ? 'px' : setting.widthUnit}`;
        
        if (this.plugin.isInLivePreviewMode && el.parentElement) {
            el.parentElement.style.height = `${size.height}${setting.heightUnit}`;
            el.parentElement.style.width = `${size.width}${setting.widthUnit}`;
        }
    }
}
