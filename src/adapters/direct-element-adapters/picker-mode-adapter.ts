import InteractifyPlugin from '../../core/interactify-plugin';
import {
    UnitContext,
    FileStats,
    SourceData,
} from '../../interactify-unit/types/interfaces';
import BaseAdapter from '../base-adapter';
import { InteractifyAdapters } from '../types/constants';

export default class PickerModeAdapter extends BaseAdapter {
    constructor(plugin: InteractifyPlugin, fileStats: FileStats) {
        super(plugin, fileStats);
    }

    initialize = async (el: SVGElement | HTMLImageElement) => {
        const ctx = this.matchInteractiveElement(el);
        if (ctx === undefined) {
            this.plugin.showNotice(
                'This type of content is unsupported. Please check the plugin settings.',
                5000
            );
            return;
        }
        await this.processUnit(ctx);
    };

    async processUnit(context: Partial<UnitContext>): Promise<void> {
        await this.baseUnitProcessing(
            InteractifyAdapters.PickerMode,
            context,
            (ctx) => {
                ctx.sourceData = this.getSource();
            }
        );
    }

    getSource(): SourceData {
        return {
            source: 'Picker mode: no source available',
            lineStart: 0,
            lineEnd: 0,
        };
    }
}
