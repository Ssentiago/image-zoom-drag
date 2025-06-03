import { MarkdownPostProcessorContext } from 'obsidian';
import { BaseAdapter } from '../base-adapter';
import { Diagram } from '../../diagram';
import { DiagramData } from '../../../settings/typing/interfaces';

export class MarkdownPreviewAdapter extends BaseAdapter {
    constructor(diagram: Diagram) {
        super(diagram);
    }

    async initialize(el: HTMLElement, context?: MarkdownPostProcessorContext) {
        if (!context) {
            return;
        }

        const diagram = await this.isThatADiagram(el);
        if (!!diagram) {
            await this.processDiagram(diagram, context);
            return;
        }

        const observer = new MutationObserver(async (mutations) => {
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
                        await this.processDiagram(diagram, context);
                    }
                }
            }
        });

        observer.observe(el, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            observer.disconnect();
        }, 5000);
    }

    async processDiagram(
        diagram: {
            diagram: DiagramData;
            element: HTMLElement;
        },
        context: MarkdownPostProcessorContext
    ) {
        const prepared = this.prepareDiagramElement(diagram.element);
        if (!prepared) {
            return;
        }
        const sourceData = this.sourceExtractionWithContext(diagram.element, {
            contextElement: diagram.element,
            context: context,
        });
        const size = this.initDiagramSize(diagram.element);
        if (size === undefined) {
            return;
        }
        const container = await this.createDiagramWrapper(diagram, sourceData);
        this.postInitDiagram(diagram, container, sourceData, size);
    }
}
