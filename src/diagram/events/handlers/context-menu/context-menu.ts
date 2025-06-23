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

        this.addChild(this.export);
        this.addChild(this.copy);
        this.addChild(this.copySource);
    }

    initialize(): void {
        this.load();

        const { container } = this.events.diagram.context;

        this.registerDomEvent(container, 'contextmenu', this.onContextMenu, {
            capture: true,
            passive: false,
        });
    }

    private readonly onContextMenu = (event: MouseEvent) => {
        const { element } = this.events.diagram.context;

        event.preventDefault();
        event.stopPropagation();

        const isThisSvg = element.matches('svg');

        this.events.diagram.context.content.focus();

        const menu = new Menu();

        menu.addItem((item) => {
            item.setIcon('download');
            item.setTitle('Export diagram image');
            item.onClick(async () => {
                await this.export.export();
            });
        });

        menu.addItem((item) => {
            item.setIcon('copy');
            item.setTitle(`Copy diagram ${!isThisSvg ? 'image' : 'SVG code'}`);
            item.onClick(async () => {
                await this.copy.copy();
            });
        });

        menu.addItem((item) => {
            item.setIcon('file-text');
            item.setTitle('Copy diagram source');
            item.onClick(async () => {
                await this.copySource.copy();
            });
        });

        menu.showAtMouseEvent(event);
    };
}
