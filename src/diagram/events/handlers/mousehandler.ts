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
        this.load();
        const { container } = this.events.diagram.context;

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
        const container = this.events.diagram.context.container;
        const content = this.events.diagram.context.content;
        return { container, content };
    }

    private readonly wheel = (event: WheelEvent): void => {
        if (
            !event.ctrlKey &&
            document.fullscreenElement !== this.events.diagram.context.content
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
            (viewportCenterX - contentCenterX) / this.events.diagram.scale;
        const offsetY =
            (viewportCenterY - contentCenterY) / this.events.diagram.scale;

        const factor = event.deltaY < 0 ? 1.1 : 0.9;

        const prevScale = this.events.diagram.scale;
        this.events.diagram.scale += event.deltaY * -0.001;
        this.events.diagram.scale = Math.max(0.125, this.events.diagram.scale);

        const scaleDiff = this.events.diagram.scale - prevScale;
        this.events.diagram.dx -= offsetX * scaleDiff;
        this.events.diagram.dy -= offsetY * scaleDiff;

        content.setCssStyles({
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
        const { container, content } = this.elements;

        container.focus({ preventScroll: true });
        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;

        this.initialX = this.events.diagram.dx;
        this.initialY = this.events.diagram.dy;
        content.setCssStyles({
            cursor: 'grabbing',
        });
        event.preventDefault();
    };

    private readonly mouseMove = (event: MouseEvent): void => {
        if (!this.isDragging) {
            return;
        }
        const { content } = this.elements;

        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        this.events.diagram.dx = this.initialX + dx;
        this.events.diagram.dy = this.initialY + dy;
        content.setCssStyles({
            transform: `translate(${this.events.diagram.dx}px, ${this.events.diagram.dy}px) scale(${this.events.diagram.scale})`,
        });
    };

    private readonly mouseUp = (event: MouseEvent): void => {
        const { content } = this.elements;

        this.isDragging = false;
        content.setCssStyles({ cursor: 'grab' });
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
