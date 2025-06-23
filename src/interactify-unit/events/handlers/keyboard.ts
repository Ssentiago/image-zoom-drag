import { Component } from 'obsidian';

import Events from '../events';
import { Handler } from '../types/interfaces';

export class Keyboard extends Component implements Handler {
    constructor(private readonly events: Events) {
        super();
    }

    initialize(): void {
        this.load();
        const { container } = this.events.unit.context;

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
                this.events.unit.actions.moveElement(0, 50, {
                    animated: true,
                });
                break;
            case 'ArrowDown':
                this.events.unit.actions.moveElement(0, -50, {
                    animated: true,
                });
                break;
            case 'ArrowLeft':
                this.events.unit.actions.moveElement(50, 0, {
                    animated: true,
                });
                break;
            case 'ArrowRight':
                this.events.unit.actions.moveElement(-50, 0, {
                    animated: true,
                });
                break;
        }

        if (event.ctrlKey) {
            switch (key) {
                case 'Equal':
                    this.events.unit.actions.zoomElement(1.1, {
                        animated: true,
                    });
                    break;
                case 'Minus':
                    this.events.unit.actions.zoomElement(0.9, {
                        animated: true,
                    });
                    break;
                case 'Digit0':
                    this.events.unit.actions.resetZoomAndMove({
                        animated: true,
                    });
                    break;
            }
        }
    };
}
