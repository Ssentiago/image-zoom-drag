import IntegratedMode from '@/modes/integrated-mode/integrated-mode';
import {
    PreviewContextData,
    UnitContext,
    FileStats,
    SourceData,
} from '@/modes/integrated-mode/interactify-unit/types/interfaces';

import { MarkdownPostProcessorContext } from 'obsidian';

import InteractifyPlugin from '../../../../core/interactify-plugin';
import { LeafID } from '../../../../core/types/definitions';
import { InteractifyAdapters } from '../types/constants';
import { BaseMdViewAdapter } from './base-md-view-adapter';

export class PreviewAdapter extends BaseMdViewAdapter {
    constructor(integratedMode: IntegratedMode, fileStats: FileStats) {
        super(integratedMode, fileStats);
    }

    initialize = async (
        leafID: LeafID,
        el: Element,
        context: MarkdownPostProcessorContext
    ): Promise<void> => {
        this.integratedMode.plugin.logger.debug(
            'MarkdownPreviewAdapter initializing',
            {
                leafID,
            }
        );

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
        contextData: PreviewContextData
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
                await this.processUnit(interactiveElement, contextData);
            }
        }
    }

    async setupMutationObserver(
        leafID: LeafID,
        el: Element,
        contextData: PreviewContextData
    ): Promise<void> {
        const observer = new MutationObserver(async (mutations) => {
            this.integratedMode.plugin.logger.debug(
                'Preview MutationObserver triggered',
                {
                    mutationsCount: mutations.length,
                }
            );

            if (!this.integratedMode.plugin._loaded) {
                observer.disconnect();
                return;
            }

            for (const mutation of this.childListMutations(mutations)) {
                for (const context of this.interactiveElementContexts(
                    mutation.addedNodes
                )) {
                    await this.processUnit(context, contextData);
                }
            }
        });

        observer.observe(el, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            observer.disconnect();
            this.integratedMode.plugin.logger.debug(
                'Preview MutationObserver disconnected after timeout'
            );
        }, 5000);
    }

    getSource(contextData: PreviewContextData): SourceData {
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

    async processUnit(
        context: Partial<UnitContext>,
        contextData: PreviewContextData
    ): Promise<void> {
        await this.baseUnitProcessing(
            InteractifyAdapters.Preview,
            context,
            (ctx) => {
                ctx.sourceData = this.getSource(contextData);
            }
        );
    }
}
