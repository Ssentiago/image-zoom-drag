import { Component, Menu } from 'obsidian';

import Events from '../../events';
import { Handler } from '../../types/interfaces';
import { CopyUnit } from './context-actions/copy-unit';
import { CopyUnitSource } from './context-actions/copy-unit-source';
import { Export } from './context-actions/export';
import Info from './context-actions/info/info';

export class ContextMenu extends Component implements Handler {
    private readonly export: Export;
    private readonly copy: CopyUnit;
    private readonly copySource: CopyUnitSource;
    private readonly info: Info;

    constructor(public readonly events: Events) {
        super();

        this.export = new Export(this);
        this.copy = new CopyUnit(this);
        this.copySource = new CopyUnitSource(this);
        this.info = new Info(this);

        this.addChild(this.export);
        this.addChild(this.copy);
        this.addChild(this.copySource);
        this.addChild(this.info);
    }

    initialize(): void {
        this.load();

        const { container } = this.events.unit.context;

        this.registerDomEvent(container, 'contextmenu', this.onContextMenu, {
            capture: true,
            passive: false,
        });
    }

    private readonly onContextMenu = (event: MouseEvent) => {
        const { element } = this.events.unit.context;

        event.preventDefault();
        event.stopPropagation();

        const isThisSvg = element.matches('svg');

        this.events.unit.context.content.focus();

        const menu = new Menu();

        menu.addItem((item) => {
            item.setIcon('download');
            item.setTitle('Export as image');
            item.onClick(async () => {
                await this.export.export();
            });
        });

        menu.addItem((item) => {
            item.setIcon('copy');
            item.setTitle(`Copy ${!isThisSvg ? 'as image' : 'as SVG code'}`);
            item.onClick(async () => {
                await this.copy.copy();
            });
        });

        menu.addItem((item) => {
            item.setIcon('file-text');
            item.setTitle('Copy as source');
            item.onClick(async () => {
                await this.copySource.copy();
            });
        });

        menu.addItem((item) => {
            item.setIcon('info');
            item.setTitle('Info');
            item.onClick(async () => {
                this.info.showInfo();
            });
        });

        menu.showAtMouseEvent(event);
    };
}
