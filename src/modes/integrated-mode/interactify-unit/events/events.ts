import { Component } from 'obsidian';

import InteractifyUnit from '../interactify-unit';
import { ContextMenu } from './handlers/context-menu/context-menu';
import { Focus } from './handlers/focus';
import { Keyboard } from './handlers/keyboard';
import { Mouse } from './handlers/mouse';
import { Touch } from './handlers/touch';

export default class Events extends Component {
    private readonly mouse: Mouse;
    private readonly touch: Touch;
    private readonly keyboard: Keyboard;
    private readonly focus: Focus;
    private readonly contextMenu: ContextMenu;

    constructor(public unit: InteractifyUnit) {
        super();

        this.mouse = new Mouse(this);
        this.touch = new Touch(this);
        this.keyboard = new Keyboard(this);
        this.focus = new Focus(this);
        this.contextMenu = new ContextMenu(this);

        this.addChild(this.mouse);
        this.addChild(this.touch);
        this.addChild(this.keyboard);
        this.addChild(this.focus);
        this.addChild(this.contextMenu);
    }

    initialize(): void {
        this.load();
        this.mouse.initialize();
        this.touch.initialize();
        this.keyboard.initialize();
        this.focus.initialize();
        this.contextMenu.initialize();
    }
}
