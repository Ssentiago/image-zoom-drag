import { Component, Menu } from 'obsidian';

import { ContextMenu } from '../context-menu';

export default class OpenInPopup extends Component {
    constructor(private contextMenu: ContextMenu) {
        super();
    }

    openPopupForImage(image: HTMLImageElement | SVGElement) {
        this.contextMenu.events.unit.plugin.popupMode.showPopupForImage(image);
    }
}
