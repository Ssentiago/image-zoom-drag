import { Component } from 'obsidian';

import { ContextMenu } from '../context-menu';

export class CopyUnitSource extends Component {
    constructor(private readonly contextMenu: ContextMenu) {
        super();
    }

    async copy() {
        const source = this.contextMenu.events.unit.context.sourceData.source;
        await navigator.clipboard.writeText(source);
        this.contextMenu.events.unit.plugin.showNotice('Copied');
    }
}
