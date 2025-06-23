import { Component } from 'obsidian';

import { DiagramAdapters } from '../adapters/types/constants';
import { ActivationMode } from '../settings/types/interfaces';
import InteractiveElement from './interactiveElement';

export default class InteractiveStateManager extends Component {
    intersectionObserver: IntersectionObserver | null = null;

    constructor(private readonly ie: InteractiveElement) {
        super();
        this.load();
    }

    initialize() {
        this.ie.plugin.eventBus.on('toggle-element', this.onToggleElement);
        this.scheduleActivationIfNeeded();
    }

    private scheduleActivationIfNeeded(): void {
        if (this.ie.context.adapter === DiagramAdapters.PickerModeAdapter) {
            queueMicrotask(async () => await this.activate());
            return;
        }

        const settings = this.ie.plugin.settings;
        if (!settings.data.diagrams.interactive.markdown.autoDetect) {
            return;
        }

        switch (settings.data.diagrams.interactive.markdown.activationMode) {
            case ActivationMode.Immediate:
                queueMicrotask(async () => await this.activate());
                break;
            case ActivationMode.Lazy:
                this.setupIntersectionObserver();
                break;
        }
    }

    onToggleElement = async (data: { element: Element }) => {
        if (data.element === this.ie.context.element) {
            this.ie.active ? await this.deactivate() : await this.activate();
        }
    };

    activate = async () => {
        if (this.ie.active) {
            return;
        }

        this.ie.context.element.setAttribute(
            'data-interactive-mode',
            'interactive'
        );

        await this.smoothTransition(
            this.ie.context.originalParent,
            async () => {
                await this.switchToInteractive();
                this.ie.initialize();
            }
        );
        this.ie.context.originalParent.style.removeProperty('transition');
        this.ie.context.originalParent.style.removeProperty('transform');
    };

    deactivate = async () => {
        if (!this.ie.active) {
            return;
        }
        this.ie.context.element.setAttribute(
            'data-interactive-mode',
            'non-interactive'
        );

        await this.smoothTransition(
            this.ie.context.originalParent,
            async () => {
                this.ie.unload();
                this.ie.controlPanel.controlPanel?.remove();
                await this.switchToNonInteractive();
            }
        );
        this.ie.context.originalParent.style.removeProperty('transition');
        this.ie.context.originalParent.style.removeProperty('transform');
    };

    private async smoothTransition(
        element: HTMLElement,
        callback: () => Promise<void>
    ) {
        const transition = element.animate(
            [
                { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
                { opacity: '0', transform: 'scale(0.96)', filter: 'blur(1px)' },
            ],
            { duration: 150, fill: 'forwards' }
        );

        await transition.finished;
        await callback();

        return element.animate(
            [
                { opacity: '0', transform: 'scale(0.96)', filter: 'blur(1px)' },
                { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
            ],
            { duration: 200, easing: 'ease-out', fill: 'forwards' }
        ).finished;
    }

    async switchToInteractive() {
        this.ie.active = true;

        this.ie.plugin.logger.debug(
            `Switch interactive element with id ${this.ie.id} to interactive state`
        );

        const { content, container, element, originalParent } = this.ie.context;

        this.ie.context.content.setCssStyles({
            transform: `translate(${this.ie.dx}px, ${this.ie.dy}px) scale(${this.ie.scale})`,
        });

        // SVG elements in the case of Obsidian are often generated on the go
        // For example, Mermaid
        // And they have their own styles that they apply to images based on classes
        if (this.ie.context.element instanceof SVGElement) {
            const originalParentClasses = originalParent.className.trim();
            originalParentClasses &&
                content.addClasses(originalParentClasses.split(/\s+/));
            content.removeClass('live-preview-parent');
            originalParent.className = '';
        }

        this.ie.context.adapter === DiagramAdapters.LivePreview &&
            this.ie.context.livePreviewWidget?.addClass('live-preview-parent');
        if (this.ie.context.livePreviewWidget) {
            this.ie.registerDomEvent(
                this.ie.context.livePreviewWidget,
                'click',
                (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                },
                true
            );
        }
        originalParent.replaceChild(container, element);
        container.appendChild(content);
        content.appendChild(element);

        await this.waitForElementsLayout([element, content, container]);
    }

    private async switchToNonInteractive() {
        this.ie.active = false;

        this.ie.plugin.logger.debug(
            `Switch interactive element with id ${this.ie.id} to non-interactive state`
        );

        const { content, container, element, originalParent } = this.ie.context;

        if (this.ie.context.element instanceof SVGElement) {
            originalParent.className = content.className;
            originalParent.removeClass('diagram-content');
        }

        if (this.ie.context.adapter === DiagramAdapters.LivePreview) {
            const lPreviewWidget = this.ie.context.livePreviewWidget;
            lPreviewWidget?.removeClass('live-preview-parent');
            lPreviewWidget?.style?.removeProperty('height');
            lPreviewWidget?.style?.removeProperty('width');
        }

        originalParent.replaceChild(element, container);
        container.remove();
        content.remove();

        await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    private waitForElementsLayout(elements: Element[]): Promise<void> {
        return new Promise((resolve) => {
            const checkLayout = () => {
                if (!this._loaded) {
                    resolve();
                    return;
                }

                const allReady = elements.every((el) => {
                    const rect = el.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                });

                if (!allReady) {
                    requestAnimationFrame(checkLayout);
                    return;
                }

                const elementRect = elements[0].getBoundingClientRect();
                if (this.ie.context.size.width === 0) {
                    this.ie.context.size.width = elementRect.width;
                }
                if (this.ie.context.size.height === 0) {
                    this.ie.context.size.height = elementRect.height;
                }
                resolve();
            };

            requestAnimationFrame(checkLayout);
        });
    }

    private setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(async (entry) => {
                    if (entry.intersectionRatio > 0.7) {
                        this.intersectionObserver?.disconnect();
                        this.intersectionObserver = null;

                        await this.activate();
                    }
                });
            },
            {
                root: null,
                threshold: [0, 0.1, 0.5, 1.0],
            }
        );
        this.intersectionObserver.observe(this.ie.context.element);
    }

    onunload() {
        super.onunload();
        this.ie.plugin.eventBus.off('toggle-element', this.onToggleElement);
        this.intersectionObserver?.disconnect();

        this.ie.context.element.removeAttribute(
            'data-interactive-initialization-status'
        );
        this.ie.context.element.removeAttribute('data-interactive-mode');
    }
}
