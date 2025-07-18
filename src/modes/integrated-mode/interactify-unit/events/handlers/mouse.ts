import { Component } from 'obsidian';

import { TriggerType } from '../../types/constants';
import Events from '../events';
import { Handler } from '../types/interfaces';

export class Mouse extends Component implements Handler {
    private startX!: number;
    private startY!: number;
    private initialX!: number;
    private initialY!: number;
    private isDragging = false;

    constructor(private readonly events: Events) {
        super();
    }

    initialize(): void {
        this.load();
        const { container } = this.events.unit.context;

        this.registerDomEvent(container, 'wheel', this.wheel);
        this.registerDomEvent(container, 'wheel', this.wheelScroll);

        this.registerDomEvent(container, 'mousedown', this.mouseDown);

        this.registerDomEvent(container, 'mousemove', this.mouseMove);

        this.registerDomEvent(container, 'mouseup', this.mouseUp);
        this.registerDomEvent(container, 'mouseleave', this.mouseLeave);

        this.registerDomEvent(container, 'mouseenter', this.mouseEnter);
    }

    get elements() {
        const container = this.events.unit.context.container;
        const content = this.events.unit.context.content;
        return { container, content };
    }

    private readonly wheel = (event: WheelEvent): void => {
        if (
            !event.ctrlKey &&
            document.fullscreenElement !== this.events.unit.context.content
        ) {
            return;
        }

        if (event.shiftKey || event.altKey) {
            return;
        }

        const { content, container } = this.elements;

        const viewportCenterX = event.clientX;
        const viewportCenterY = event.clientY;

        const contentRect = content.getBoundingClientRect();
        const contentCenterX = contentRect.left + contentRect.width / 2;
        const contentCenterY = contentRect.top + contentRect.height / 2;

        const offsetX =
            (viewportCenterX - contentCenterX) / this.events.unit.scale;
        const offsetY =
            (viewportCenterY - contentCenterY) / this.events.unit.scale;

        const factor = event.deltaY < 0 ? 1.1 : 0.9;

        const prevScale = this.events.unit.scale;
        this.events.unit.scale += event.deltaY * -0.001;
        this.events.unit.scale = Math.max(0.125, this.events.unit.scale);

        const scaleDiff = this.events.unit.scale - prevScale;
        this.events.unit.dx -= offsetX * scaleDiff;
        this.events.unit.dy -= offsetY * scaleDiff;

        content.setCssStyles({
            transform: `translate(${this.events.unit.dx}px, ${this.events.unit.dy}px) scale(${this.events.unit.scale})`,
        });

        event.preventDefault();
        event.stopPropagation();
    };

    private readonly wheelScroll = (event: WheelEvent): void => {
        if (!(event.shiftKey || event.altKey)) {
            return;
        }

        const isHorizontal = event.shiftKey && !event.altKey;
        const isVertical = event.shiftKey && event.altKey;

        let x = 0,
            y = 0;

        if (isHorizontal) {
            x = event.deltaY > 0 ? 20 : -20;
        }
        if (isVertical) {
            y = event.deltaY > 0 ? 20 : -20;
        }

        this.events.unit.actions.moveElement(x, y, { animated: true });

        event.preventDefault();
        event.stopPropagation();
    };

    private readonly mouseDown = (event: MouseEvent): void => {
        if (event.button !== 0) {
            return;
        }
        const { container, content } = this.elements;

        container.focus({ preventScroll: true });
        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;

        this.initialX = this.events.unit.dx;
        this.initialY = this.events.unit.dy;
        content.setCssStyles({
            cursor: 'grabbing',
        });

        event.preventDefault();
        event.stopPropagation();
    };

    private readonly mouseMove = (event: MouseEvent): void => {
        if (!this.isDragging) {
            return;
        }
        const { content } = this.elements;

        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        this.events.unit.dx = this.initialX + dx;
        this.events.unit.dy = this.initialY + dy;
        content.setCssStyles({
            transform: `translate(${this.events.unit.dx}px, ${this.events.unit.dy}px) scale(${this.events.unit.scale})`,
        });

        event.preventDefault();
        event.stopPropagation();
    };

    private readonly mouseUp = (event: MouseEvent): void => {
        const { content } = this.elements;

        this.isDragging = false;
        content.setCssStyles({ cursor: 'grab' });

        event.preventDefault();
        event.stopPropagation();
    };

    private readonly mouseLeave = (event: MouseEvent): void => {
        this.mouseUp(event);
        this.events.unit.controlPanel.hide(TriggerType.MOUSE);

        event.preventDefault();
        event.stopPropagation();
    };

    private readonly mouseEnter = (event: MouseEvent): void => {
        this.events.unit.controlPanel.show(TriggerType.MOUSE);
        event.preventDefault();
        event.stopPropagation();
    };
}
