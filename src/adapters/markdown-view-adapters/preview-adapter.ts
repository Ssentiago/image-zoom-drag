import { MarkdownPostProcessorContext } from 'obsidian';

import DiagramZoomDragPlugin from '../../core/diagram-zoom-drag-plugin';
import { LeafID } from '../../core/types/definitions';
import {
    ContextData,
    DiagramContext,
    FileStats,
    SourceData,
} from '../../diagram/types/interfaces';
import { DiagramAdapters } from '../types/constants';
import { BaseMdViewAdapter } from './base-md-view-adapter';

export class PreviewAdapter extends BaseMdViewAdapter {
    constructor(plugin: DiagramZoomDragPlugin, fileStats: FileStats) {
        super(plugin, fileStats);
    }

    initialize = async (
        leafID: LeafID,
        el: Element,
        context: MarkdownPostProcessorContext
    ): Promise<void> => {
        this.plugin.logger.debug('MarkdownPreviewAdapter initializing', {
            leafID,
        });

        const contextData = {
            context: context,
            contextEl: el as HTMLElement,
        };

        await this.setupMutationObserver(leafID, el, contextData);
        await this.processExistingElements(leafID, el, contextData);

        await new Promise((resolve) => requestAnimationFrame(resolve));
        await this.processExistingElements(leafID, el, contextData);
    };

    async processExistingElements(
        leafID: LeafID,
        el: Element,
        contextData: ContextData
    ): Promise<void> {
        let interactiveElements = Array.from(
            contextData.contextEl.querySelectorAll('svg,img')
        );
        interactiveElements = interactiveElements.filter(
            (el) => !this.isThisSvgIcon(el)
        );

        if (interactiveElements.length > 0) {
            const interactiveElementsWithContext = interactiveElements.map(
                this.matchInteractiveElement.bind(this)
            );
            for (const interactiveElement of interactiveElementsWithContext) {
                if (interactiveElement === undefined) {
                    continue;
                }
                await this.processDiagram(interactiveElement, contextData);
            }
        }
    }

    async setupMutationObserver(
        leafID: LeafID,
        el: Element,
        contextData: ContextData
    ): Promise<void> {
        const observer = new MutationObserver(async (mutations) => {
            this.plugin.logger.debug('Preview MutationObserver triggered', {
                mutationsCount: mutations.length,
            });

            if (!this.plugin._loaded) {
                observer.disconnect();
                return;
            }

            for (const mutation of this.childListMutations(mutations)) {
                for (const context of this.interactiveElementContexts(
                    mutation.addedNodes
                )) {
                    await this.processDiagram(context, contextData);
                }
            }
        });

        observer.observe(el, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            observer.disconnect();
            this.plugin.logger.debug(
                'Preview MutationObserver disconnected after timeout'
            );
        }, 5000);
    }

    getSource(contextData: ContextData): SourceData {
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

        if (sectionsInfo.lineEnd === sectionsInfo.lineStart) {
            return {
                source: sectionsInfo.text,
                lineStart: sectionsInfo.lineStart,
                lineEnd: sectionsInfo.lineEnd,
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

    async processDiagram(
        context: Partial<DiagramContext>,
        contextData: ContextData
    ): Promise<void> {
        await this.baseDiagramProcessing(
            DiagramAdapters.Preview,
            context,
            (ctx) => {
                ctx.sourceData = this.getSource(contextData);
            }
        );
    }
}
