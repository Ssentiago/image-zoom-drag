import { Component } from 'obsidian';

import Events from '../events';
import { Handler } from '../types/interfaces';

export class KeyboardHandler extends Component implements Handler {
    constructor(private readonly events: Events) {
        super();
    }

    initialize(): void {
        const container = this.events.diagram.container;

        this.registerDomEvent(container, 'keydown', this.keyDown);
    }

    keyDown = (event: KeyboardEvent): void => {
        const key = event.code;
        const KEYS = [
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Equal',
            'Minus',
            'Digit0',
        ];
        if (!KEYS.includes(key)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();

        switch (key) {
            case 'ArrowUp':
                this.events.diagram.actions.moveElement(0, 50, {
                    animated: true,
                });
                break;
            case 'ArrowDown':
                this.events.diagram.actions.moveElement(0, -50, {
                    animated: true,
                });
                break;
            case 'ArrowLeft':
                this.events.diagram.actions.moveElement(50, 0, {
                    animated: true,
                });
                break;
            case 'ArrowRight':
                this.events.diagram.actions.moveElement(-50, 0, {
                    animated: true,
                });
                break;
        }

        if (event.ctrlKey) {
            switch (key) {
                case 'Equal':
                    this.events.diagram.actions.zoomElement(1.1, {
                        animated: true,
                    });
                    break;
                case 'Minus':
                    this.events.diagram.actions.zoomElement(0.9, {
                        animated: true,
                    });
                    break;
                case 'Digit0':
                    this.events.diagram.actions.resetZoomAndMove({
                        animated: true,
                    });
                    break;
            }
        }
    };
}
