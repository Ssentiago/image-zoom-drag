import InteractiveElement from '../interactiveElement';
import { DiagramActionOptions } from './types/interfaces';

export class DiagramActions {
    constructor(public diagram: InteractiveElement) {}

    moveElement(dx: number, dy: number, options?: DiagramActionOptions): void {
        const content = this.diagram.context.content;
        this.diagram.dx += dx;
        this.diagram.dy += dy;
        content.setCssStyles({
            transition: options?.animated ? 'transform 0.3s ease-out' : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
        });

        if (options?.animated) {
            this.diagram.registerDomEvent(
                content,
                'transitionend',
                () => {
                    content.setCssStyles({
                        transition: 'none',
                    });
                },
                { once: true }
            );
        }
    }

    zoomElement(factor: number, options?: DiagramActionOptions): void {
        const { content, container } = this.diagram.context;

        const containerRect = container.getBoundingClientRect();
        const viewportCenterX = containerRect.left + containerRect.width / 2;
        const viewportCenterY = containerRect.top + containerRect.height / 2;

        const contentRect = content.getBoundingClientRect();
        const contentCenterX = contentRect.left + contentRect.width / 2;
        const contentCenterY = contentRect.top + contentRect.height / 2;

        const offsetX = (viewportCenterX - contentCenterX) / this.diagram.scale;
        const offsetY = (viewportCenterY - contentCenterY) / this.diagram.scale;

        this.diagram.scale *= factor;
        this.diagram.scale = Math.max(0.125, this.diagram.scale);

        this.diagram.dx =
            this.diagram.dx -
            (offsetX * (factor - 1) * this.diagram.scale) / factor;
        this.diagram.dy =
            this.diagram.dy -
            (offsetY * (factor - 1) * this.diagram.scale) / factor;
        content.setCssStyles({
            transition: options?.animated
                ? 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
                : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
        });

        if (options?.animated) {
            this.diagram.registerDomEvent(
                content,
                'transitionend',
                () => {
                    content.setCssStyles({
                        transition: 'none',
                    });
                },
                { once: true }
            );
        }
    }
    resetZoomAndMove(options?: DiagramActionOptions): void {
        this.fitToContainer(options);
    }

    fitToContainer(options?: DiagramActionOptions): void {
        const { content, container } = this.diagram.context;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const diagramWidth = content.clientWidth;
        const diagramHeight = content.clientHeight;

        this.diagram.scale = Math.min(
            containerWidth / diagramWidth,
            containerHeight / diagramHeight,
            1
        );
        this.diagram.dx =
            (containerWidth - diagramWidth * this.diagram.scale) / 2;
        this.diagram.dy =
            (containerHeight - diagramHeight * this.diagram.scale) / 2;

        content.setCssStyles({
            transition: options?.animated
                ? 'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
                : 'none',
            transform: `translate(${this.diagram.dx}px, ${this.diagram.dy}px) scale(${this.diagram.scale})`,
            transformOrigin: 'top left',
        });

        if (options?.animated) {
            this.diagram.plugin.context.view!.registerDomEvent(
                content,
                'transitionend',
                () => {
                    content.setCssStyles({
                        transition: 'none',
                    });
                },
                { once: true }
            );
        }
    }
}
