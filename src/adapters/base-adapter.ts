import DiagramZoomDragPlugin from '../core/diagram-zoom-drag-plugin';
import DiagramFactory from '../diagram/diagram-factory';
import InteractiveElement from '../diagram/interactiveElement';
import {
    InteractiveInitialization,
    SupportedDiagrams,
} from '../diagram/types/constants';
import {
    DiagramContext,
    DiagramSize,
    FileStats,
} from '../diagram/types/interfaces';
import { DiagramData } from '../settings/types/interfaces';
import { DiagramAdapters } from './types/constants';
import { HTMLElementWithCMView } from './types/interfaces';

export default abstract class BaseAdapter {
    protected constructor(
        protected plugin: DiagramZoomDragPlugin,
        protected fileStat: FileStats
    ) {}

    abstract initialize: (...args: any[]) => Promise<void>;

    abstract getSource(...args: any[]): any;

    matchInteractiveElement(element: Element):
        | {
              element: HTMLImageElement | SVGElement;
              options: DiagramData;
          }
        | undefined {
        const interactive = element as HTMLImageElement | SVGElement;
        const diagrams = this.plugin.settings.data.diagrams.supported_diagrams;

        const specific = diagrams.filter(
            (d) =>
                ![
                    SupportedDiagrams.IMG_SVG,
                    SupportedDiagrams.Default,
                ].includes(d.selector as SupportedDiagrams)
        );
        const defaults = diagrams.filter((d) =>
            [SupportedDiagrams.IMG_SVG, SupportedDiagrams.Default].includes(
                d.selector as SupportedDiagrams
            )
        );

        for (const diagram of [...specific, ...defaults]) {
            if (!diagram.on) continue;

            if (
                element.matches(diagram.selector) ||
                element.closest(diagram.selector)
            ) {
                return {
                    element: interactive,
                    options: JSON.parse(JSON.stringify(diagram)) as DiagramData,
                };
            }
        }
        return undefined;
    }

    protected initializationGuard(context: Partial<DiagramContext>): boolean {
        if (
            context.element!.dataset.interactiveInitializationStatus !==
            undefined
        ) {
            return false;
        }

        const initializationStatus = !(context.element as HTMLElementWithCMView)
            .cmView
            ? InteractiveInitialization.Initialized
            : InteractiveInitialization.NotInitialized;

        context.element!.setAttribute(
            'data-interactive-initialization-status',
            initializationStatus
        );

        return (
            initializationStatus !== InteractiveInitialization.NotInitialized
        );
    }

    isThisSvgIcon(element: Element): boolean {
        // Fast verification - not svg at all
        if (!(element instanceof SVGElement)) {
            return false;
        }

        const svg = element;

        // Checking the button
        if (svg.closest('button') || svg.closest('.edit-block-button')) {
            return true;
        }

        // Class check
        if (svg.classList.contains('svg-icon')) {
            return true;
        }

        // SVG sizes
        const rect = svg.getBoundingClientRect();
        if (
            rect.width > 0 &&
            rect.width <= 32 &&
            rect.height > 0 &&
            rect.height <= 32
        ) {
            return true;
        }

        // The dimensions of the parent
        const parent = svg.parentElement;
        if (parent) {
            const pRect = parent.getBoundingClientRect();
            if (
                pRect.width > 0 &&
                pRect.width <= 32 &&
                pRect.height > 0 &&
                pRect.height <= 32
            ) {
                return true;
            }
        }

        return false;
    }
    protected getElSize(diagramContext: Partial<DiagramContext>): DiagramSize {
        const el = diagramContext.element;

        const rect = el!.getBoundingClientRect();

        return {
            width: rect.width,
            height: rect.height,
        };
    }

    protected createDiagram(diagramContext: DiagramContext): void {
        const diagram = DiagramFactory.createDiagram(
            this.plugin,
            diagramContext,
            this.fileStat
        );
        this.emitCreated(diagram);
    }

    protected emitCreated(diagram: InteractiveElement): void {
        this.plugin.eventBus.emit('diagram.created', diagram);
    }

    finalizeContext(ctx: Partial<DiagramContext>): DiagramContext {
        if (
            !ctx.element ||
            !ctx.sourceData ||
            !ctx.size ||
            !ctx.container ||
            !ctx.content ||
            !ctx.options
        ) {
            throw new Error('Incomplete context');
        }
        return ctx as DiagramContext;
    }

    async createInteractiveElementWrapper(
        diagramContext: Partial<DiagramContext>
    ): Promise<Partial<DiagramContext>> {
        const container = document.createElement('div');
        const content = document.createElement('div');

        container.addClass('diagram-container');
        content.addClass('diagram-content');

        const el = diagramContext.element!;
        const originalParent = el.parentElement as HTMLElement;

        const renderingMode = this.plugin.context.inPreviewMode
            ? 'preview'
            : 'live-preview';

        container.setAttribute(
            'data-diagram-zoom-drag-rendering-mode',
            `${renderingMode}`
        );
        container.setAttribute(
            'data-folded',
            this.plugin.settings.data.diagrams.folding.foldByDefault.toString()
        );
        container.setAttribute('tabindex', '0');

        return { container, content, originalParent };
    }

    async baseDiagramProcessing(
        adapter: DiagramAdapters,
        context: Partial<DiagramContext>,
        callbackBeforeDiagramCreating: (
            context: Partial<DiagramContext>
        ) => void
    ) {
        context.adapter = adapter;

        this.plugin.logger.debug(`Processing diagram for adapter: ${adapter}`, {
            diagramType: context.options!.name,
        });

        const canContinue = this.initializationGuard(context);

        if (!canContinue) {
            this.plugin.logger.debug(
                `Initialization guard failed for adapter: ${adapter}`
            );
            return;
        }

        const size = this.getElSize(context);

        const { container, content, originalParent } =
            await this.createInteractiveElementWrapper(context);

        context.container = container!;
        context.content = content!;
        context.originalParent = originalParent!;
        context.size = size;

        callbackBeforeDiagramCreating(context);

        const fContext = this.finalizeContext(context);

        this.createDiagram(fContext);
        this.plugin.logger.debug(
            `Adapter ${adapter} was processed successfully.`
        );
    }
}
