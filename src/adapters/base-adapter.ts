import InteractifyPlugin from '../core/interactify-plugin';
import InteractifyUnit from '../interactify-unit/interactify-unit';
import InteractifyUnitFactory from '../interactify-unit/interactify-unit-factory';
import {
    InteractiveInitialization,
    ImageConfigs,
} from '../interactify-unit/types/constants';
import {
    UnitContext,
    UnitSize,
    FileStats,
} from '../interactify-unit/types/interfaces';
import { ImageConfig } from '../settings/types/interfaces';
import { InteractifyAdapters } from './types/constants';
import { HTMLElementWithCMView } from './types/interfaces';

export default abstract class BaseAdapter {
    protected constructor(
        protected plugin: InteractifyPlugin,
        protected fileStat: FileStats
    ) {}

    abstract initialize: (...args: any[]) => Promise<void>;

    abstract getSource(...args: any[]): any;

    matchInteractiveElement(element: Element):
        | {
              element: HTMLImageElement | SVGElement;
              options: ImageConfig;
          }
        | undefined {
        const interactive = element as HTMLImageElement | SVGElement;
        const units = this.plugin.settings.data.units.configs;

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

        let status = false;

        if (
            context.adapter === InteractifyAdapters.LivePreview &&
            !(context.element as HTMLElementWithCMView).cmView
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

    isThisSvgIcon(element: Element): boolean {
        // Fast verification - not svg at all
        if (!(element instanceof SVGElement)) {
            return false;
        }

        const svg = element;

        // Checking the button
        if (svg.closest('button') || svg.closest('.edit-block-button')) {
            return true;
        }

        // Class check
        if (svg.classList.contains('svg-icon')) {
            return true;
        }

        // SVG sizes
        const rect = svg.getBoundingClientRect();
        if (
            rect.width > 0 &&
            rect.width <= 32 &&
            rect.height > 0 &&
            rect.height <= 32
        ) {
            return true;
        }

        // The dimensions of the parent
        const parent = svg.parentElement;
        if (parent) {
            const pRect = parent.getBoundingClientRect();
            if (
                pRect.width > 0 &&
                pRect.width <= 32 &&
                pRect.height > 0 &&
                pRect.height <= 32
            ) {
                return true;
            }
        }

        return false;
    }
    protected getElSize(context: Partial<UnitContext>): UnitSize {
        const el = context.element;

        const rect = el!.getBoundingClientRect();

        return {
            width: rect.width,
            height: rect.height,
        };
    }

    protected createUnit(context: UnitContext): void {
        const unit = InteractifyUnitFactory.createUnit(
            this.plugin,
            context,
            this.fileStat
        );
        this.emitCreated(unit);
    }

    protected emitCreated(unit: InteractifyUnit): void {
        this.plugin.eventBus.emit('unit.created', unit);
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

        const renderingMode = this.plugin.context.inPreviewMode
            ? 'preview'
            : 'live-preview';

        container.setAttribute(
            'data-interactify-rendering-mode',
            `${renderingMode}`
        );
        container.setAttribute(
            'data-folded',
            this.plugin.settings.data.units.folding.foldByDefault.toString()
        );
        container.setAttribute('tabindex', '0');

        return { container, content, originalParent };
    }

    async baseUnitProcessing(
        adapter: InteractifyAdapters,
        context: Partial<UnitContext>,
        callbackBeforeUnitCreating: (context: Partial<UnitContext>) => void
    ) {
        context.adapter = adapter;

        this.plugin.logger.debug(`Processing unit for adapter: ${adapter}`, {
            unitType: context.options!.name,
        });

        const canContinue = this.initializationGuard(context);

        if (!canContinue) {
            this.plugin.logger.debug(
                `Initialization guard failed for adapter: ${adapter}`
            );
            return;
        }

        const size = this.getElSize(context);

        const { container, content, originalParent } =
            await this.createInteractiveElementWrapper(context);

        context.container = container!;
        context.content = content!;
        context.originalParent = originalParent!;
        context.size = size;

        callbackBeforeUnitCreating(context);

        const fContext = this.finalizeContext(context);

        this.createUnit(fContext);
        this.plugin.logger.debug(
            `Adapter ${adapter} was processed successfully.`
        );
    }
}
