import { Component } from 'obsidian';

import Events from '../events';
import { Handler } from '../types/interfaces';

export class TouchHandler extends Component implements Handler {
    private startX!: number;
    private startY!: number;
    private initialDistance!: number;
    private isDragging = false;
    private isPinching = false;

    constructor(private readonly diagramEvents: Events) {
        super();
    }

    /**
     * Adds touch event listeners to the given container element.
     *
     * This function registers the following touch event listeners to the given container element:
     * - `touchstart`: Handles the start of a touch event for the container element.
     * - `touchmove`: Handles the movement during a touch event for the container element.
     * - `touchend`: Handles the end of a touch event for the container element.
     *
     * @param container - The container element to add the touch event listeners to.
     */
    initialize(): void {
        const container = this.diagramEvents.diagram.container;

        this.registerDomEvent(container, 'touchstart', this.touchStart, {
            passive: false,
        });
        this.registerDomEvent(container, 'touchmove', this.touchMove, {
            passive: false,
        });
        this.registerDomEvent(container, 'touchend', this.touchEnd, {
            passive: false,
        });
    }

    /**
     * Handles the `touchstart` event on the given container element.
     *
     * If native touch event handling is enabled, this function does nothing.
     *
     * Otherwise, this function sets the active container to the given container,
     * prevents the default behavior of the event, and stops the event from propagating.
     *
     * If there is only one touch point, this function sets the `isDragging` flag to
     * true and records the starting position of the touch.
     *
     * If there are two touch points, this function sets the `isPinching` flag to
     * true and records the initial distance between the two touch points.
     *
     * @param container - The container element that received the touch event.
     * @param e - The `TouchEvent` object that represents the touch event.
     */
    private readonly touchStart = (e: TouchEvent): void => {
        if (this.diagramEvents.diagram.nativeTouchEventsEnabled) {
            return;
        }
        const target = e.target as HTMLElement;

        // we got touch to a button panel - returning
        if (target.closest('.diagram-zoom-drag-panel')) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();

        if (e.touches.length === 1) {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            this.isPinching = true;
            this.initialDistance = this.calculateDistance(e.touches);
        }
    };

    /**
     * Handles the `touchmove` event on the given container element.
     *
     * If native touch event handling is enabled, this function does nothing.
     *
     * Otherwise, this function prevents the default behavior of the event
     * and stops the event from propagating. It updates the active container
     * to the given container.
     *
     * If there is one touch point and dragging is enabled, the function
     * calculates the displacement since the last touch position and moves
     * the diagram element by that displacement.
     *
     * If there are two touch points and pinching is enabled, the function
     * calculates the scaling factor based on the change in distance between
     * the touch points and zooms the diagram element by that factor.
     *
     * @param container - The container element that received the touch event.
     * @param e - The `TouchEvent` object that represents the touch event.
     */
    private readonly touchMove = (e: TouchEvent): void => {
        if (this.diagramEvents.diagram.nativeTouchEventsEnabled) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const element = this.diagramEvents.diagram.context.diagramElement;

        if (!element) {
            return;
        }

        if (this.isDragging && e.touches.length === 1) {
            const dx = e.touches[0].clientX - this.startX;
            const dy = e.touches[0].clientY - this.startY;

            this.diagramEvents.diagram.actions.moveElement(dx, dy);

            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        } else if (this.isPinching && e.touches.length === 2) {
            const currentDistance = this.calculateDistance(e.touches);
            const factor = currentDistance / this.initialDistance;

            this.diagramEvents.diagram.actions.zoomElement(factor);

            this.initialDistance = currentDistance;
        }
    };

    /**
     * Handles the `touchend` event on the given container element.
     *
     * If native touch event handling is enabled, this function does nothing.
     *
     * Otherwise, this function prevents the default behavior of the event
     * and stops the event from propagating. It updates the active container
     * to the given container. It also resets the `isDragging` and `isPinching`
     * flags to false.
     *
     * @param container - The container element that received the touch event.
     * @param e - The `TouchEvent` object that represents the touch event.
     */
    private readonly touchEnd = (e: TouchEvent): void => {
        if (this.diagramEvents.diagram.nativeTouchEventsEnabled) {
            return;
        }
        const container = this.diagramEvents.diagram.container;

        const target = e.target as HTMLElement;

        // we got touch to a button panel - returning
        if (target.closest('.diagram-zoom-drag-panel')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        this.isDragging = false;
        this.isPinching = false;
    };

    /**
     * Calculates the distance between the two touch points.
     *
     * @param touches - The two touch points.
     * @returns The distance between the two touch points.
     */
    private calculateDistance(touches: TouchList): number {
        const [touch1, touch2] = [touches[0], touches[1]];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
