import { Component } from 'obsidian';

import { TriggerType } from '../../types/constants';
import Events from '../events';
import { Handler } from '../types/interfaces';

export class MouseHandler extends Component implements Handler {
    private startX!: number;
    private startY!: number;
    private initialX!: number;
    private initialY!: number;
    private isDragging = false;

    constructor(private readonly events: Events) {
        super();
    }

    initialize(): void {
        const { container } = this.events.diagram;

        this.registerDomEvent(container, 'wheel', this.wheel, {
            passive: true,
        });
        this.registerDomEvent(container, 'wheel', this.wheelScroll, {
            passive: true,
        });

        this.registerDomEvent(container, 'mousedown', this.mouseDown);

        this.registerDomEvent(container, 'mousemove', this.mouseMove);

        this.registerDomEvent(container, 'mouseup', this.mouseUp);
        this.registerDomEvent(container, 'mouseleave', this.mouseLeave);

        this.registerDomEvent(
            container,
            'mouseenter',
            this.mouseEnterOnDiagram
        );
        this.registerDomEvent(
            container,
            'mouseleave',
            this.mouseLeaveOutDiagram
        );
    }

    get elements() {
        const container = this.events.diagram.container;
        const element = this.events.diagram.context.diagramElement;
        return { container, element };
    }

    private readonly wheel = (event: WheelEvent): void => {
        if (
            !event.ctrlKey &&
            document.fullscreenElement !== this.events.diagram.container
        ) {
            return;
        }

        if (event.shiftKey || event.altKey) {
            return;
        }

        const { element } = this.elements;

        const rect = element.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const prevScale = this.events.diagram.scale;
        this.events.diagram.scale += event.deltaY * -0.001;
        this.events.diagram.scale = Math.max(0.125, this.events.diagram.scale);

        const dx = offsetX * (1 - this.events.diagram.scale / prevScale);
        const dy = offsetY * (1 - this.events.diagram.scale / prevScale);

        this.events.diagram.dx += dx;
        this.events.diagram.dy += dy;

        element.setCssStyles({
            transform: `translate(${this.events.diagram.dx}px, ${this.events.diagram.dy}px) scale(${this.events.diagram.scale})`,
        });
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

        this.events.diagram.actions.moveElement(x, y, { animated: true });
    };

    private readonly mouseDown = (event: MouseEvent): void => {
        if (event.button !== 0) {
            return;
        }
        const { container, element } = this.elements;

        container.focus({ preventScroll: true });
        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;

        this.initialX = this.events.diagram.dx;
        this.initialY = this.events.diagram.dy;
        element.setCssStyles({
            cursor: 'grabbing',
        });
        event.preventDefault();
    };

    private readonly mouseMove = (event: MouseEvent): void => {
        if (!this.isDragging) {
            return;
        }
        const { element } = this.elements;

        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        this.events.diagram.dx = this.initialX + dx;
        this.events.diagram.dy = this.initialY + dy;
        element.setCssStyles({
            transform: `translate(${this.events.diagram.dx}px, ${this.events.diagram.dy}px) scale(${this.events.diagram.scale})`,
        });
    };

    private readonly mouseUp = (event: MouseEvent): void => {
        const { element } = this.elements;

        this.isDragging = false;
        element.setCssStyles({ cursor: 'grab' });
    };

    private readonly mouseLeave = (event: MouseEvent): void => {
        this.mouseUp(event);
    };

    private readonly mouseEnterOnDiagram = (e: MouseEvent): void => {
        this.events.diagram.controlPanel.show(TriggerType.MOUSE);
    };

    private readonly mouseLeaveOutDiagram = (e: MouseEvent): void => {
        this.events.diagram.controlPanel.hide(TriggerType.MOUSE);
    };
}
