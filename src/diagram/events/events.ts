import { Component } from 'obsidian';

import InteractiveElement from '../interactiveElement';
import { ContextMenu } from './handlers/context-menu/context-menu';
import { FocusHandler } from './handlers/focus-handler';
import { KeyboardHandler } from './handlers/keyboardhandler';
import { MouseHandler } from './handlers/mousehandler';
import { TouchHandler } from './handlers/touchhandler';

export default class Events extends Component {
    private readonly mouse: MouseHandler;
    private readonly touch: TouchHandler;
    private readonly keyboard: KeyboardHandler;
    private readonly focus: FocusHandler;
    private readonly contextMenu: ContextMenu;

    constructor(public diagram: InteractiveElement) {
        super();

        this.mouse = new MouseHandler(this);
        this.touch = new TouchHandler(this);
        this.keyboard = new KeyboardHandler(this);
        this.focus = new FocusHandler(this);
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
