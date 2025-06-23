import { Component } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';

import { ContextMenu } from '../../context-menu';
import InfoModal from './info-modal';

export interface DiagramInfo {
    name: string;
    selector: string;
    enabled: boolean;
    dimensions: {
        width: number;
        height: number;
    };
    sourceLocation: {
        lineStart: number;
        lineEnd: number;
        linesCount: number;
    };
    panels: Array<{
        name: string;
        enabled: boolean;
    }>;
    elementType: string;
}

export default class Info extends Component {
    modalDiv: HTMLDivElement | undefined;
    reactRoot: Root | undefined;

    constructor(private readonly contextMenu: ContextMenu) {
        super();
    }

    showInfo() {
        const info = this.info;

        this.modalDiv ??= document.createElement('div');
        document.body.appendChild(this.modalDiv);

        if (!this.reactRoot) {
            this.reactRoot = createRoot(this.modalDiv);
            this.reactRoot.render(
                <InfoModal
                    info={info}
                    onClose={this.closeModal}
                />
            );
        }
    }

    closeModal = () => {
        this.reactRoot?.unmount();
        this.reactRoot = undefined;
        this.modalDiv?.remove();
        this.modalDiv = undefined;
    };

    private get info() {
        const diagram = this.contextMenu.events.diagram;
        const element = diagram.context.element;
        const dSize = diagram.context.size;
        const sourceData = diagram.context.sourceData;
        const config = diagram.context.options;

        const info: DiagramInfo = {
            name: config.name,
            selector: config.selector,
            enabled: config.on,
            dimensions: {
                width: dSize.width,
                height: dSize.height,
            },
            sourceLocation: {
                lineStart: sourceData.lineStart,
                lineEnd: sourceData.lineEnd,
                linesCount: sourceData.lineEnd - sourceData.lineStart + 1,
            },
            panels: Object.entries(config.panels).map(([name, panel]) => ({
                name,
                enabled: panel.on,
            })),
            elementType: element.tagName.toLowerCase(),
        };

        return info;
    }

    onunload() {
        super.onunload();
        this.closeModal();
    }
}
