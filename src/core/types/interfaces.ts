import InteractifyUnit from '@/modes/integrated-mode/interactify-unit/interactify-unit';

import { MarkdownView, WorkspaceLeaf } from 'obsidian';

import { LeafID } from './definitions';

export interface Data {
    units: InteractifyUnit[];
    livePreviewObserver: MutationObserver | undefined;
    resizeObserver: ResizeObserver | undefined;
}

export interface OrphanData {
    units: InteractifyUnit[];
}
