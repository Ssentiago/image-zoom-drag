import { BaseUnitContext } from '@/core/services/types/interfaces';
import IntegratedMode from '@/modes/integrated-mode/integrated-mode';
import {
    FileStats,
    UnitContext,
} from '@/modes/integrated-mode/interactify-unit/types/interfaces';

import BaseAdapter from './base-adapter';
import { InteractifyAdapters } from './types/constants';

export class MdViewAdapter extends BaseAdapter {
    constructor(
        readonly integratedMode: IntegratedMode,
        readonly fileStat: FileStats
    ) {
        super(integratedMode, fileStat);
    }

    initialize = async (elementCtx: BaseUnitContext) => {
        const interactiveCtx = this.matchInteractiveElement(elementCtx.element);
        if (!interactiveCtx) {
            return;
        }

        const unitCtx = {
            ...interactiveCtx,
            ...elementCtx,
        } as Partial<UnitContext>;

        const adapter =
            elementCtx.mode === 'live-preview'
                ? InteractifyAdapters.LivePreview
                : InteractifyAdapters.Preview;

        await this.unitProcessing(adapter, unitCtx);
    };
}
