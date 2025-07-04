import InteractifyPlugin from '@/core/interactify-plugin';
import { LeafID } from '@/core/types/definitions';
import IntegratedMode from '@/modes/integrated-mode/integrated-mode';
import {
    FileStats,
    UnitContext,
} from '@/modes/integrated-mode/interactify-unit/types/interfaces';

import BaseAdapter from '../base-adapter';

export abstract class BaseMdViewAdapter extends BaseAdapter {
    protected constructor(
        protected integratedMode: IntegratedMode,
        protected fileStat: FileStats
    ) {
        super(integratedMode, fileStat);
    }

    abstract initialize: (
        leafID: LeafID,
        el: Element,
        ...args: any[]
    ) => Promise<void>;

    *childListMutations(
        mutations: MutationRecord[]
    ): IterableIterator<MutationRecord> {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                yield mutation;
            }
        }
    }
    *interactiveElementContexts(
        addedNodes: NodeList
    ): IterableIterator<Partial<UnitContext>> {
        for (const addedNode of Array.from(addedNodes)) {
            if (!(addedNode instanceof Element)) {
                continue;
            }

            const interactive =
                (addedNode.matches('svg,img') && addedNode) ||
                addedNode.querySelector('svg,img');

            if (!interactive) {
                continue;
            }

            if (this.isThisSvgIcon(interactive)) {
                continue;
            }

            const interactiveContext =
                this.matchInteractiveElement(interactive);
            if (interactiveContext === undefined) {
                continue;
            }

            yield interactiveContext;
        }
    }
}
