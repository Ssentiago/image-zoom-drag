import { BaseAdapter } from '../base-adapter';
import { Diagram } from '../../diagram';
import { MarkdownPostProcessorContext } from 'obsidian';
import { DiagramData } from '../../../settings/typing/interfaces';

export class MarkdownLivePreviewAdapter extends BaseAdapter {
    elementObservers = new Map<HTMLElement, MutationObserver>();

    constructor(diagram: Diagram) {
        super(diagram);
    }

    async initialize(el: HTMLElement, context?: MarkdownPostProcessorContext) {
        if (this.diagram.livePreviewObserver) {
            return;
        }

        const elementObservers = new Map<HTMLElement, MutationObserver>();

        const createPreviewObserver = (
            target: HTMLElement
        ): MutationObserver => {
            const observer = new MutationObserver(
                async (mutations, observer) => {
                    for (const mutation of mutations) {
                        const target = mutation.target as HTMLElement;
                        if (target.tagName !== 'DIV') {
                            continue;
                        }
                        const diagram = await this.checkForDiagram(target);
                        if (!!diagram) {
                            await this.processDiagram(diagram);
                            observer.disconnect();
                            elementObservers.delete(target);
                        }
                    }
                }
            );

            elementObservers.set(target, observer);
            observer.observe(target, {
                childList: true,
                subtree: true,
            });

            setTimeout(() => {
                observer.disconnect();
                elementObservers.delete(target);
            }, 5000);

            return observer;
        };

        this.diagram.livePreviewObserver = new MutationObserver(
            async (mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type !== 'childList') {
                        continue;
                    }
                    for (const addedNode of Array.from(mutation.addedNodes)) {
                        const target = addedNode as HTMLElement;

                        if (target.tagName !== 'DIV') {
                            continue;
                        }

                        if (
                            !target?.matches(
                                '.cm-preview-code-block.cm-embed-block'
                            )
                        ) {
                            continue;
                        }
                        const diagram = await this.checkForDiagram(target);
                        if (diagram) {
                            await this.processDiagram(diagram);
                            continue;
                        }

                        createPreviewObserver(target);
                    }
                }
            }
        );

        const blocks = el.querySelectorAll(
            '.cm-preview-code-block.cm-embed-block'
        );
        for (const block of Array.from(blocks)) {
            const diagram = await this.checkForDiagram(block as HTMLElement);
            if (diagram) {
                await this.processDiagram(diagram);
            } else {
                createPreviewObserver(block as HTMLElement);
            }
        }

        this.diagram.livePreviewObserver.observe(el, {
            childList: true,
            subtree: true,
        });
    }

    async processDiagram(diagram: {
        diagram: DiagramData;
        element: HTMLElement;
    }) {
        const prepared = this.prepareDiagramElement(diagram.element);
        if (!prepared) {
            return;
        }
        const sourceData = this.sourceExtractionWithoutContext(diagram.element);
        this.initDiagramSize(diagram.element);

        diagram.element.parentElement?.addClass('live-preview-parent');
        const container = await this.createDiagramWrapper(diagram, sourceData);
        container.addClass('live-preview');
        container.parentElement?.toggleClass(
            'folded',
            this.diagram.plugin.settings.collapseByDefault
        );
        this.postInitDiagram(diagram, container, sourceData);
    }
}
