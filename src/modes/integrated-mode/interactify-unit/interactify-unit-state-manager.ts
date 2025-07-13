import { InteractifyAdapters } from '@/modes/integrated-mode/adapters/types/constants';

import { Component } from 'obsidian';

import { ActivationMode } from '../../../settings/types/interfaces';
import InteractifyUnit from './interactify-unit';
import { InteractiveMode } from './types/constants';

export default class InteractifyUnitStateManager extends Component {
    intersectionObserver: IntersectionObserver | null = null;

    constructor(private readonly unit: InteractifyUnit) {
        super();
        this.load();
    }

    async initialize() {
        this.unit.plugin.emitter.on(
            'toggle-integrated-element',
            this.onToggleElement
        );
        await this.scheduleActivationIfNeeded();
    }

    private async scheduleActivationIfNeeded() {
        if (this.unit.context.adapter === InteractifyAdapters.PickerMode) {
            await this.activate();
            return;
        }

        const settings = this.unit.plugin.settings;
        if (!settings.$.units.interactivity.markdown.autoDetect) {
            return;
        }

        switch (settings.$.units.interactivity.markdown.activationMode) {
            case ActivationMode.Immediate:
                await this.activate(true);
                break;
            case ActivationMode.Lazy:
                this.setupIntersectionObserver();
                break;
        }
    }

    onToggleElement = async (data: { element: Element }) => {
        if (data.element === this.unit.context.element) {
            this.unit.active ? await this.deactivate() : await this.activate();
        }
    };

    activate = async (noAnimation?: boolean) => {
        if (this.unit.active) {
            return;
        }

        this.unit.context.element.setAttribute(
            'data-interactive-mode',
            InteractiveMode.Interactive
        );

        if (noAnimation) {
            await this.switchToInteractive();
            this.unit.initialize();
        } else {
            await this.smoothTransition(
                this.unit.context.originalParent,
                async () => {
                    await this.switchToInteractive();
                    this.unit.initialize();
                }
            );
        }

        this.unit.context.originalParent.style.removeProperty('transition');
        this.unit.context.originalParent.style.removeProperty('transform');
    };

    deactivate = async () => {
        if (!this.unit.active) {
            return;
        }
        this.unit.context.element.setAttribute(
            'data-interactive-mode',
            InteractiveMode.NonInteractive
        );

        await this.smoothTransition(
            this.unit.context.originalParent,
            async () => {
                this.unit.unload();
                this.unit.controlPanel.controlPanel?.remove();
                await this.switchToNonInteractive();
            }
        );
        this.unit.context.originalParent.style.removeProperty('transition');
        this.unit.context.originalParent.style.removeProperty('transform');
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
        this.unit.active = true;

        this.unit.plugin.logger.debug(
            `Switch unit with id ${this.unit.id} to interactive state`
        );

        const { content, container, element, originalParent } =
            this.unit.context;

        this.unit.context.content.setCssStyles({
            transform: `translate(${this.unit.dx}px, ${this.unit.dy}px) scale(${this.unit.scale})`,
        });

        // SVG elements in the case of Obsidian are often generated on the go
        // For example, Mermaid
        // And they have their own styles that they apply to images based on classes
        if (this.unit.context.element instanceof SVGElement) {
            const originalParentClasses = originalParent.className.trim();
            originalParentClasses &&
                content.addClasses(originalParentClasses.split(/\s+/));
            content.removeClass('live-preview-parent');
            originalParent.className = '';
        }

        this.unit.context.adapter === InteractifyAdapters.LivePreview &&
            this.unit.context.livePreviewWidget?.addClass(
                'live-preview-parent'
            );
        if (this.unit.context.livePreviewWidget) {
            this.unit.registerDomEvent(
                this.unit.context.livePreviewWidget,
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
        this.unit.active = false;

        this.unit.plugin.logger.debug(
            `Switch unit with id ${this.unit.id} to non-interactive state`
        );

        const { content, container, element, originalParent } =
            this.unit.context;

        if (this.unit.context.element instanceof SVGElement) {
            originalParent.className = content.className;
            originalParent.removeClass('interactify-content');
        }

        if (this.unit.context.adapter === InteractifyAdapters.LivePreview) {
            const lPreviewWidget = this.unit.context.livePreviewWidget;
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
                if (this.unit.context.size.width === 0) {
                    this.unit.context.size.width = elementRect.width;
                }
                if (this.unit.context.size.height === 0) {
                    this.unit.context.size.height = elementRect.height;
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
        this.intersectionObserver.observe(this.unit.context.element);
    }

    onunload() {
        super.onunload();
        this.unit.plugin.emitter.off(
            'toggle-integrated-element',
            this.onToggleElement
        );
        this.intersectionObserver?.disconnect();

        this.unit.context.element.removeAttribute(
            'data-interactive-initialization-status'
        );
        this.unit.context.element.removeAttribute('data-interactive-mode');
    }
}
