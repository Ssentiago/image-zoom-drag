import { Component } from 'obsidian';

import { ContextMenu } from '../context-menu';

export class CopyDiagramSource extends Component {
    constructor(private readonly contextMenu: ContextMenu) {
        super();
    }

    async copy() {
        const source =
            this.contextMenu.events.diagram.context.sourceData.source;
        await navigator.clipboard.writeText(source);
        this.contextMenu.events.diagram.plugin.showNotice('Copied');
    }
}
