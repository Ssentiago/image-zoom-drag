import IntegratedMode from '@/modes/integrated-mode/integrated-mode';
import InteractifyUnit from '@/modes/integrated-mode/interactify-unit/interactify-unit';
import InteractifyUnitFactory from '@/modes/integrated-mode/interactify-unit/interactify-unit-factory';
import {
    InteractiveInitialization,
    ImageConfigs,
} from '@/modes/integrated-mode/interactify-unit/types/constants';
import {
    UnitContext,
    UnitSize,
    FileStats,
} from '@/modes/integrated-mode/interactify-unit/types/interfaces';

import InteractifyPlugin from '../../../core/interactify-plugin';
import { ImageConfig } from '../../../settings/types/interfaces';
import { InteractifyAdapters } from './types/constants';
import { HTMLElementWithCMView } from './types/interfaces';

export default abstract class BaseAdapter {
    protected constructor(
        protected integratedMode: IntegratedMode,
        protected fileStat: FileStats
    ) {}

    abstract initialize: (...args: any[]) => Promise<void>;

    matchInteractiveElement(
        element: Element
    ): Partial<UnitContext> | undefined {
        const interactive = element as HTMLImageElement | SVGElement;
        const units = this.integratedMode.plugin.settings.$.units.configs;

        const specific = units.filter(
            (u) =>
                ![ImageConfigs.IMG_SVG, ImageConfigs.Default].includes(
                    u.selector as ImageConfigs
                )
        );
        const defaults = units.filter((u) =>
            [ImageConfigs.IMG_SVG, ImageConfigs.Default].includes(
                u.selector as ImageConfigs
            )
        );

        for (const unit of [...specific, ...defaults]) {
            if (!unit.on) continue;

            if (
                element.matches(unit.selector) ||
                element.closest(unit.selector)
            ) {
                return {
                    element: interactive,
                    options: JSON.parse(JSON.stringify(unit)) as ImageConfig,
                };
            }
        }
        return undefined;
    }

    protected initializationGuard(context: Partial<UnitContext>): boolean {
        if (
            context.element!.dataset.interactiveInitializationStatus !==
            undefined
        ) {
            return false;
        }

        let status = true;

        if (
            context.adapter === InteractifyAdapters.LivePreview &&
            (context.element as HTMLElementWithCMView).cmView
        ) {
            status = false;
        } else if (
            [
                InteractifyAdapters.Preview,
                InteractifyAdapters.PickerMode,
            ].includes(context.adapter!)
        ) {
            status = true;
        }
        context.element!.setAttribute(
            'data-interactive-initialization-status',
            status
                ? InteractiveInitialization.Initialized
                : InteractiveInitialization.NotInitialized
        );

        return status;
    }

    detectDiagramLayout(
        width: number,
        height: number
    ): 'tall' | 'wide' | 'proportional' {
        const ratio = width / height;

        if (ratio > 1.5) return 'wide';
        if (ratio < 0.67) return 'tall';

        return 'proportional';
    }

    protected getElSize(context: Partial<UnitContext>): UnitSize {
        const el = context.element;

        const rect = el!.getBoundingClientRect();

        return {
            width: rect.width,
            height: rect.height,
        };
    }

    protected async createUnit(context: UnitContext) {
        const unit = await InteractifyUnitFactory.createUnit(
            this.integratedMode.plugin,
            context,
            this.fileStat
        );
        this.emitCreated(unit);
    }

    protected emitCreated(unit: InteractifyUnit): void {
        this.integratedMode.plugin.emitter.emit('unit.created', unit);
    }

    finalizeContext(ctx: Partial<UnitContext>): UnitContext {
        if (
            !ctx.element ||
            !ctx.sourceData ||
            !ctx.size ||
            !ctx.container ||
            !ctx.content ||
            !ctx.options
        ) {
            throw new Error('Incomplete context');
        }
        return ctx as UnitContext;
    }

    async createInteractiveElementWrapper(
        context: Partial<UnitContext>
    ): Promise<Partial<UnitContext>> {
        const container = document.createElement('div');
        const content = document.createElement('div');

        container.addClass('interactify-container');
        content.addClass('interactify-content');

        const el = context.element!;
        const originalParent = el.parentElement as HTMLElement;

        const renderingMode = this.integratedMode.plugin.integratedMode.context
            .inPreviewMode
            ? 'preview'
            : 'live-preview';

        container.setAttribute(
            'data-interactify-rendering-mode',
            `${renderingMode}`
        );
        container.setAttribute(
            'data-folded',
            this.integratedMode.plugin.settings.$.units.folding.foldByDefault.toString()
        );
        container.setAttribute('tabindex', '0');

        return { container, content, originalParent };
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

    async unitProcessing(
        adapter: InteractifyAdapters,
        context: Partial<UnitContext>
    ) {
        context.adapter = adapter;

        this.integratedMode.plugin.logger.debug(
            `Processing unit for adapter: ${adapter}`,
            {
                unitType: context.options!.name,
            }
        );

        const canContinue = this.initializationGuard(context);

        if (!canContinue) {
            this.integratedMode.plugin.logger.debug(
                `Initialization guard failed for adapter: ${adapter}`
            );
            return;
        }

        if (context.mode === 'live-preview') {
            const livePreviewWidget = this.findElementWithLivePreviewWidget(
                context.element
            );
            if (livePreviewWidget) {
                context.livePreviewWidget = livePreviewWidget;
            }
        }

        const size = this.getElSize(context);
        const layout = this.detectDiagramLayout(size.width, size.height);

        const { container, content, originalParent } =
            await this.createInteractiveElementWrapper(context);

        context.container = container!;
        context.content = content!;
        context.originalParent = originalParent!;
        context.size = size;
        context.layout = layout;

        const fContext = this.finalizeContext(context);

        await this.createUnit(fContext);
        this.integratedMode.plugin.logger.debug(
            `Adapter ${adapter} was processed successfully.`
        );
    }
}
