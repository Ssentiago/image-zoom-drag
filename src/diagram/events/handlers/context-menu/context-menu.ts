import { Component, Menu } from 'obsidian';

import Events from '../../events';
import { Handler } from '../../types/interfaces';
import { CopyDiagram } from './context-actions/copy-diagram';
import { CopyDiagramSource } from './context-actions/copy-diagram-source';
import { Export } from './context-actions/export';

export class ContextMenu extends Component implements Handler {
    private readonly export: Export;
    private readonly copy: CopyDiagram;
    private readonly copySource: CopyDiagramSource;

    constructor(public readonly events: Events) {
        super();

        this.export = new Export(this);
        this.copy = new CopyDiagram(this);
        this.copySource = new CopyDiagramSource(this);
    }

    initialize(): void {
        const container = this.events.diagram.container;

        this.registerDomEvent(container, 'contextmenu', this.onContextMenu, {
            capture: true,
            passive: false,
        });
    }

    private readonly onContextMenu = (event: MouseEvent) => {
        const container = this.events.diagram.container;

        event.preventDefault();
        event.stopPropagation();

        const isThisSvg = container.querySelector('svg');

        this.events.diagram.container.focus();

        const menu = new Menu();

        menu.addItem((item) => {
            item.setTitle('Export diagram image');
            item.onClick(async () => {
                await this.export.export();
            });
        });

        menu.addItem((item) => {
            item.setTitle(`Copy diagram ${!isThisSvg ? 'image' : 'SVG code'}`);
            item.onClick(async () => {
                await this.copy.copy();
            });
        });

        menu.addItem((item) => {
            item.setTitle('Copy diagram source');
            item.onClick(async () => {
                await this.copySource.copy();
            });
        });

        menu.showAtMouseEvent(event);
    };
}
