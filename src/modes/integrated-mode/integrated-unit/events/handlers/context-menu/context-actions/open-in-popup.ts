import { Component, Menu } from 'obsidian';

import { ContextMenu } from '../context-menu';

export default class OpenInPopup extends Component {
    constructor(private contextMenu: ContextMenu) {
        super();
    }

    async openPopupForImage(
        image: HTMLImageElement | SVGElement
    ): Promise<void> {
        await this.contextMenu.events.unit.plugin.popupMode.showPopupForImage(
            image
        );
    }
}
