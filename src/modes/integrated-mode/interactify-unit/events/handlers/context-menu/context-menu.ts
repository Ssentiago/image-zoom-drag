import { Component, Menu } from 'obsidian';

import Events from '../../events';
import { Handler } from '../../types/interfaces';
import { Copy } from './context-actions/copy';
import { Export } from './context-actions/export';
import Info from './context-actions/info/info';
import OpenInPopup from './context-actions/open-in-popup';

export class ContextMenu extends Component implements Handler {
    private readonly export: Export;
    private readonly copy: Copy;
    private readonly info: Info;
    private readonly openInPopup: OpenInPopup;

    constructor(public readonly events: Events) {
        super();

        this.export = new Export(this);
        this.copy = new Copy(this);
        this.info = new Info(this);
        this.openInPopup = new OpenInPopup(this);

        this.addChild(this.export);
        this.addChild(this.copy);
        this.addChild(this.info);
        this.addChild(this.openInPopup);
    }

    initialize(): void {
        this.load();

        const { container } = this.events.unit.context;

        this.registerDomEvent(
            container,
            'contextmenu',
            (e) => {
                const settings = this.events.unit.plugin.settings.$;

                const origin = this.events.unit.context.origin;

                if (
                    !settings.units.contextMenu.showForDiagrams &&
                    origin === 'generated'
                ) {
                    return;
                }

                if (
                    !settings.units.contextMenu.showForOtherImages &&
                    origin !== 'generated'
                ) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                this.onContextMenu(e);
            },
            {
                capture: true,
                passive: false,
            }
        );
    }

    private readonly onContextMenu = (event: MouseEvent) => {
        const { element } = this.events.unit.context;

        this.events.unit.context.content.focus();
        this.showMenu(event, element);
    };

    showMenu(event: MouseEvent, element: HTMLImageElement | SVGElement): void {
        const menu = this.createMenu(element);
        menu.showAtMouseEvent(event);
    }

    createMenu(element: HTMLImageElement | SVGElement): Menu {
        const menu = new Menu();

        menu.addItem((item) => {
            item.setIcon('download');
            item.setTitle('Export as...');

            const submenu = item.setSubmenu();

            submenu.addItem((item) => {
                item.setIcon('file-export');
                item.setTitle('PNG');
                item.onClick(async () => {
                    await this.export.exportAsPNG(element);
                });
            });

            submenu.addItem((item) => {
                item.setIcon('image');
                item.setTitle('JPG');
                item.onClick(async () => {
                    await this.export.exportAsJPG(element);
                });
            });

            element instanceof SVGElement &&
                submenu.addItem((item) => {
                    item.setIcon('file-code');
                    item.setTitle('SVG');
                    item.onClick(async () => {
                        await this.export.exportAsSVG(element);
                    });
                });
        });

        menu.addItem((item) => {
            item.setIcon('copy');
            item.setTitle(`Copy as...`);

            const submenu = item.setSubmenu();

            submenu.addItem((item) => {
                item.setIcon('image');
                item.setTitle('PNG');
                item.onClick(async () => {
                    await this.copy.copyAsPNG(element);
                });
            });

            element instanceof SVGElement &&
                submenu.addItem((item) => {
                    item.setIcon('code-2');
                    item.setTitle('Plain code');
                    item.onClick(async () => {
                        await this.copy.copyAsPlain(element);
                    });
                });
            submenu.addItem((item) => {
                item.setIcon('file-code');
                item.setTitle('Source');
                item.onClick(async () => {
                    await this.copy.copyAsSource();
                });
            });
        });

        menu.addSeparator();

        !(element instanceof SVGElement) &&
            menu.addItem((item) => {
                item.setIcon('maximize-2');
                item.setTitle('Open this image in popup window');
                item.onClick(async () => {
                    await this.openInPopup.openPopupForImage(element);
                });
            });

        menu.addItem((item) => {
            item.setIcon('info');
            item.setTitle('Info');
            item.onClick(async () => {
                this.info.showInfo();
            });
        });

        return menu;
    }
}
