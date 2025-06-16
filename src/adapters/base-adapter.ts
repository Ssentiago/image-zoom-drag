import hash from 'hash.js';
import { MarkdownPostProcessorContext } from 'obsidian';

import DiagramZoomDragPlugin from '../core/diagram-zoom-drag-plugin';
import { LeafID } from '../core/types/definitions';
import Diagram from '../diagram/diagram';
import DiagramFactory from '../diagram/diagram-factory';
import {
    BaseDiagramContext,
    ContextData,
    DiagramSize,
    FileStats,
    SourceData,
} from '../diagram/types/interfaces';
import { DiagramData } from '../settings/types/interfaces';
import { ContainerID } from './types/definitions';
import { HTMLElementWithCMView } from './types/interfaces';

export abstract class BaseAdapter {
    constructor(
        protected plugin: DiagramZoomDragPlugin,
        protected fileStat: FileStats
    ) {}

    abstract initialize(
        leafID: LeafID,
        el: Element,
        context?: MarkdownPostProcessorContext,
        hasLivePreviewObserver?: boolean
    ): Promise<void>;

    /**
     * This method takes an element and checks if it is a diagram.
     * @param element - The element to check.
     * @returns A promise that resolves to an object with the diagramData and the element,
     * or undefined if the element is not a diagram.
     */
    protected async isThatADiagram(
        element: Element
    ): Promise<BaseDiagramContext | undefined> {
        const diagram = this.findDiagram(element);

        const svg = diagram?.diagramElement.querySelector('svg');
        const img = diagram?.diagramElement.querySelector('img');

        if (diagram && (!!svg || !!img)) {
            return diagram;
        }
        return undefined;
    }

    /**
     * Searches for and returns a diagram element within the given element.
     *
     * This method iterates over the supported diagrams from the plugin settings,
     * checking if they are enabled. It attempts to find an element matching the
     * diagram's selector using either `closest` or `querySelector` methods. If a
     * matching element is found, it returns an object containing the diagram's
     * data and the found diagram element.
     *
     * @param element - The element within which to search for the diagram.
     * @returns An object containing `diagramData` and `diagramElement` if a matching
     * diagram is found, or `null` if no such diagram exists.
     */
    protected findDiagram(element: Element): BaseDiagramContext | null {
        for (const diagram of this.plugin.settings.data.diagrams
            .supported_diagrams) {
            if (!diagram.on) {
                continue;
            }

            const diagramElement: HTMLElement | null =
                element.closest(diagram.selector) ??
                element.querySelector(diagram.selector);
            if (diagramElement) {
                return { diagramElement: diagramElement, diagramData: diagram };
            }
        }
        return null;
    }

    protected getDiagramSize(
        diagramDescriptor: BaseDiagramContext
    ): DiagramSize | undefined {
        const el = diagramDescriptor.diagramElement;
        const svg = el.querySelector('svg');
        const img = el.querySelector('img');

        if (svg === null && img === null) {
            return undefined;
        }

        const rect = img
            ? img.getBoundingClientRect()
            : el.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
        };
    }

    protected async genID(
        sourceData: SourceData,
        diagram: DiagramData
    ): Promise<ContainerID> {
        const preId = `${diagram.name}:${sourceData.lineStart}-${sourceData.lineEnd}`;
        const hashed_data = hash.sha256().update(preId).digest('hex');
        const ctime = this.plugin.context.view?.file?.stat.ctime ?? 0;
        return `id-${ctime}-${hashed_data}` as ContainerID;
    }

    /**
     * Extracts source code within a specified context from an HTML element.
     *
     * This method retrieves the section information of the context element
     * using the provided Markdown post-processing context. It extracts the
     * source code from the specified line range within the section.
     *
     * @param el - The HTML element from which to extract the source.
     * @param contextData - An object containing the context element and
     *                      Markdown post-processing context.
     * @returns An object containing the extracted source code and its
     *          starting and ending line numbers. If section info is
     *          unavailable, it returns default values indicating no source.
     */
    protected sourceExtractionWithContext(
        contextData: ContextData
    ): SourceData {
        const sectionsInfo = contextData.context.getSectionInfo(
            contextData.contextEl
        );

        if (!sectionsInfo) {
            return {
                source: 'No source available',
                lineStart: 0,
                lineEnd: 0,
            };
        }
        const { lineStart: ls, lineEnd: le, text } = sectionsInfo;
        const lineStart = ls + 1;
        const lineEnd = le - 1;
        const lines = text.split('\n');
        const source = lines.slice(lineStart, lineEnd + 1).join('\n');

        return {
            source: source,
            lineStart: lineStart,
            lineEnd: lineEnd,
        };
    }

    /**
     * Extracts the source code from a diagram element without using context.
     *
     * This method retrieves the source code and its line numbers from the parent
     * element's CodeMirror view data. If the widget data is unavailable, it returns
     * default values indicating that no source is available.
     *
     * @param el - The HTML element from which to extract the source.
     * @returns An object containing the extracted source code and its starting and
     *          ending line numbers. If the widget data is unavailable, it returns
     *          'No source available' with line numbers set to 0.
     */
    protected sourceExtractionWithoutContext(el: HTMLElement): SourceData {
        const parent = el.parentElement as HTMLElementWithCMView;
        const widgetData = parent.cmView?.deco?.widget;
        if (!widgetData) {
            return {
                source: 'No source available',
                lineStart: 0,
                lineEnd: 0,
            };
        }

        return {
            source: widgetData.code,
            lineStart: widgetData.lineStart,
            lineEnd: widgetData.lineEnd,
        };
    }

    async createDiagramWrapper(
        diagramDescriptor: BaseDiagramContext,
        sourceData: SourceData
    ): Promise<HTMLElement> {
        const container = document.createElement('div');
        const el = diagramDescriptor.diagramElement;
        el.addClass('diagram-content');

        container.addClass('diagram-container');
        const renderingMode = this.plugin.context.inPreviewMode
            ? 'preview'
            : 'live-preview';
        container.setAttribute(
            'data-diagram-zoom-drag-rendering-mode',
            `${renderingMode}`
        );
        el.parentNode?.insertBefore(container, el);
        container.appendChild(el);

        container.id = await this.genID(
            sourceData,
            diagramDescriptor.diagramData
        );
        container.setAttribute(
            'data-folded',
            this.plugin.settings.data.diagrams.folding.foldByDefault.toString()
        );

        container.setAttribute('tabindex', '0');

        return container;
    }

    /**
     * Performs a series of checks to ensure that the adapter is not initialized
     * on an element that has already been initialized, or is not a valid element.
     * @param el - The element to check.
     * @returns `false` if any of the checks fail, `true` otherwise.
     */
    protected initializationGuard(el: HTMLElement): boolean {
        if (!el.parentElement) {
            this.plugin.logger.debug(
                'Initialization guard failed: no parent element'
            );
            return false;
        }
        if (el.parentElement.hasClass('diagram-container')) {
            this.plugin.logger.debug(
                'Initialization guard failed: already in diagram-container'
            );
            return false;
        }
        if (el.hasClass('diagram-content')) {
            this.plugin.logger.debug(
                'Initialization guard failed: already has diagram-content class'
            );
            return false;
        }

        return true;
    }

    protected createDiagram(
        diagramDescriptor: BaseDiagramContext,
        container: HTMLElement,
        sourceData: SourceData,
        size: DiagramSize
    ): void {
        this.plugin.logger.debug('Creating diagram', {
            id: container.id,
            type: diagramDescriptor.diagramData.name,
        });
        const diagram = DiagramFactory.createDiagram(
            this.plugin,
            diagramDescriptor,
            sourceData,
            size,
            this.fileStat,
            container
        );
        this.emitCreated(diagram);
    }

    private emitCreated(diagram: Diagram): void {
        this.plugin.eventBus.emit('diagram.created', diagram);
    }
}
