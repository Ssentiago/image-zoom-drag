import { MarkdownPostProcessorContext } from 'obsidian';
import { BaseAdapter } from '../base-adapter';
import { Diagram } from '../../diagram';

export class MarkdownPreviewAdapter extends BaseAdapter {
    constructor(diagram: Diagram) {
        super(diagram);
    }

    async initialize(el: HTMLElement, context?: MarkdownPostProcessorContext) {
        if (!context) {
            return;
        }

        const maxWaitTime = 5000;
        if (!!(await this.checkForDiagram(el))) {
            return;
        }

        const observer = new MutationObserver(async () => {
            const diagram = await this.checkForDiagram(el);
            if (diagram) {
                const prepared = this.prepareDiagramElement(diagram.element);
                if (!prepared) {
                    return;
                }
                const sourceData = this.sourceExtractionWithContext(el, {
                    contextElement: diagram.element,
                    context: context,
                });
                this.initDiagramSize(el);
                const container = await this.createDiagramWrapper(
                    diagram,
                    sourceData
                );
                this.postInitDiagram(diagram, container, sourceData);
                observer.disconnect();
            }
        });

        observer.observe(el, {
            childList: true,
            subtree: true,
            attributes: false,
        });

        setTimeout(() => {
            observer.disconnect();
        }, maxWaitTime);
    }
}
