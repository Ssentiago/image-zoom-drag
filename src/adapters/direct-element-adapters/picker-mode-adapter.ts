import DiagramZoomDragPlugin from '../../core/diagram-zoom-drag-plugin';
import {
    DiagramContext,
    FileStats,
    SourceData,
} from '../../diagram/types/interfaces';
import BaseAdapter from '../base-adapter';
import { DiagramAdapters } from '../types/constants';

export default class PickerModeAdapter extends BaseAdapter {
    constructor(plugin: DiagramZoomDragPlugin, fileStats: FileStats) {
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
        await this.processDiagram(ctx);
    };

    async processDiagram(context: Partial<DiagramContext>): Promise<void> {
        await this.baseDiagramProcessing(
            DiagramAdapters.PickerModeAdapter,
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
