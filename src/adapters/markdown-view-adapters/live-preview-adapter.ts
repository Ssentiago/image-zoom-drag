import InteractifyPlugin from '../../core/interactify-plugin';
import { LeafID } from '../../core/types/definitions';
import {
    UnitContext,
    FileStats,
    SourceData,
} from '../../interactify-unit/types/interfaces';
import { InteractifyAdapters } from '../types/constants';
import { HTMLElementWithCMView } from '../types/interfaces';
import { BaseMdViewAdapter } from './base-md-view-adapter';

export class LivePreviewAdapter extends BaseMdViewAdapter {
    constructor(plugin: InteractifyPlugin, fileStats: FileStats) {
        super(plugin, fileStats);
    }

    initialize = async (
        leafID: LeafID,
        el: Element,
        hasExistingObserver: boolean
    ) => {
        if (!this.plugin.context.inLivePreviewMode) return;

        if (hasExistingObserver) {
            return;
        }

        this.setupMutationObserver(leafID, el);

        await this.processExistingElements(el);

        await new Promise((resolve) => requestAnimationFrame(resolve));

        await this.processExistingElements(el);
    };

    private async processExistingElements(el: Element): Promise<void> {
        const cmContent = el.querySelector('.cm-content');
        if (!cmContent) {
            return;
        }

        for (const child of Array.from(cmContent.children)) {
            if (!(child as HTMLElementWithCMView).cmView) {
                continue;
            }

            const interactiveElement = child.matches('svg,img')
                ? child
                : child.querySelector('svg,img');

            if (!interactiveElement) {
                continue;
            }

            if (this.isThisSvgIcon(interactiveElement)) {
                continue;
            }

            const context = this.matchInteractiveElement(interactiveElement);
            if (context === undefined) {
                continue;
            }

            await this.processUnit({
                ...context,
                livePreviewWidget: child as HTMLElementWithCMView,
            });
        }
    }

    private setupMutationObserver(leafID: LeafID, el: Element): void {
        const observer = new MutationObserver(async (mutations) => {
            this.plugin.logger.debug('Preview MutationObserver triggered', {
                mutationsCount: mutations.length,
            });

            for (const mutation of this.childListMutations(mutations)) {
                for (const context of this.interactiveElementContexts(
                    mutation.addedNodes
                )) {
                    const elementWithCmView =
                        this.findElementWithLivePreviewWidget(context.element);

                    if (elementWithCmView === undefined) {
                        continue;
                    }

                    await this.processUnit({
                        ...context,
                        livePreviewWidget: elementWithCmView,
                    });
                }
            }
        });

        this.plugin.state.setLivePreviewObserver(leafID, observer);
        observer.observe(el, { childList: true, subtree: true });
    }

    protected findElementWithLivePreviewWidget(el: Element | undefined) {
        if (el === undefined) {
            return undefined;
        }
        let current = el as HTMLElement | null | undefined;

        while (current && current !== document.body) {
            if ((current as HTMLElementWithCMView)?.cmView) {
                return current as HTMLElementWithCMView;
            }
            current = current?.parentElement;
        }
        return undefined;
    }

    getSource(parent: HTMLElementWithCMView | undefined): SourceData {
        const widget = parent?.cmView?.deco?.widget;

        const df = {
            source: 'No source available',
            lineStart: 0,
            lineEnd: 0,
        };

        if (widget === undefined) {
            return df;
        }

        if (
            'title' in widget &&
            'href' in widget &&
            'start' in widget &&
            'end' in widget
        ) {
            return {
                source: `![[${widget.href}]]`,
                lineStart: widget.start,
                lineEnd: widget.end,
            };
        }

        if ('url' in widget && 'start' in widget && 'end' in widget) {
            return {
                source: `![${widget.title || ''}](${widget.url})`,
                lineStart: widget.start,
                lineEnd: widget.end,
            };
        }

        if ('code' in widget && 'lineStart' in widget && 'lineEnd' in widget) {
            return {
                source: widget.code,
                lineStart: widget.lineStart,
                lineEnd: widget.lineEnd,
            };
        }

        return df;
    }

    async processUnit(context: Partial<UnitContext>): Promise<void> {
        await this.baseUnitProcessing(
            InteractifyAdapters.LivePreview,
            context,
            (ctx) => {
                context.sourceData = this.getSource(ctx.livePreviewWidget);

                context.livePreviewWidget!.addClass('live-preview-parent');
            }
        );
    }
}
