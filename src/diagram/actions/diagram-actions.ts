import Diagram from '../diagram';
import { DiagramActionOptions } from './types/interfaces';

export class DiagramActions {
    constructor(public diagram: Diagram) {}

    moveElement(dx: number, dy: number, options?: DiagramActionOptions): void {
        const element = this.diagram.context.diagramElement;

        this.diagram.dx += dx;
        this.diagram.dy += dy;
        element.setCssStyles({
            transition: options?.animated ? 'transform 0.3s ease-out' : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
        });

        if (options?.animated) {
            this.diagram.registerDomEvent(
                element,
                'transitionend',
                () => {
                    element.setCssStyles({
                        transition: 'none',
                    });
                },
                { once: true }
            );
        }
    }

    zoomElement(factor: number, options?: DiagramActionOptions): void {
        const element = this.diagram.context.diagramElement;

        const containerRect = this.diagram.container.getBoundingClientRect();

        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        const offsetX = (centerX - this.diagram.dx) / this.diagram.scale;
        const offsetY = (centerY - this.diagram.dy) / this.diagram.scale;

        this.diagram.scale *= factor;
        this.diagram.scale = Math.max(0.125, this.diagram.scale);

        this.diagram.dx = centerX - offsetX * this.diagram.scale;
        this.diagram.dy = centerY - offsetY * this.diagram.scale;

        element.setCssStyles({
            transition: options?.animated
                ? 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
                : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
        });

        if (options?.animated) {
            this.diagram.registerDomEvent(
                element,
                'transitionend',
                () => {
                    element.setCssStyles({
                        transition: 'none',
                    });
                },
                { once: true }
            );
        }
    }

    resetZoomAndMove(options?: DiagramActionOptions): void {
        const element = this.diagram.context.diagramElement;

        if (element) {
            this.fitToContainer(element, this.diagram.container, options);
        }
    }

    fitToContainer(
        element: HTMLElement,
        container: HTMLElement,
        options?: DiagramActionOptions
    ): void {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const diagramWidth = element.clientWidth;
        const diagramHeight = element.clientHeight;

        this.diagram.scale = Math.min(
            containerWidth / diagramWidth,
            containerHeight / diagramHeight,
            1
        );
        this.diagram.dx =
            (containerWidth - diagramWidth * this.diagram.scale) / 2;
        this.diagram.dy =
            (containerHeight - diagramHeight * this.diagram.scale) / 2;

        element.setCssStyles({
            transition: options?.animated
                ? 'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
                : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
            transformOrigin: 'top left',
        });
        if (options?.animated) {
            this.diagram.plugin.context.view!.registerDomEvent(
                element,
                'transitionend',
                () => {
                    element.setCssStyles({
                        transition: 'none',
                    });
                },
                { once: true }
            );
        }
    }
}
