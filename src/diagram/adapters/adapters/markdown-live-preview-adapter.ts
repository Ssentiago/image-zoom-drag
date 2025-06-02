import { BaseAdapter } from '../base-adapter';
import { Diagram } from '../../diagram';
import { MarkdownPostProcessorContext } from 'obsidian';
import { DiagramData } from '../../../settings/typing/interfaces';

export class MarkdownLivePreviewAdapter extends BaseAdapter {
    constructor(diagram: Diagram) {
        super(diagram);
    }

    async initialize(
        el: HTMLElement,
        context?: MarkdownPostProcessorContext
    ): Promise<void> {
        if (this.diagram.livePreviewObserver) {
            return;
        }

        this.diagram.livePreviewObserver = new MutationObserver(
            async (mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type !== 'childList') {
                        continue;
                    }
                    for (const addedNode of Array.from(mutation.addedNodes)) {
                        if (!(addedNode instanceof Element)) {
                            continue;
                        }
                        const target = addedNode;

                        const diagram = await this.isThatADiagram(target);
                        if (diagram) {
                            await this.processDiagram(diagram);
                        }
                    }
                }
            }
        );

        const livePreviewBlocks = el.querySelectorAll(
            '.cm-preview-code-block.cm-embed-block'
        );
        for (const block of Array.from(livePreviewBlocks)) {
            const diagram = await this.isThatADiagram(block);
            if (diagram) {
                await this.processDiagram(diagram);
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
            this.diagram.plugin.settings.foldByDefault
        );
        this.postInitDiagram(diagram, container, sourceData);
    }
}
