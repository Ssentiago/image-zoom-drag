import { MarkdownView, WorkspaceLeaf } from 'obsidian';

import InteractifyUnit from '../../interactify-unit/interactify-unit';
import { LeafID } from './definitions';

export interface Data {
    units: InteractifyUnit[];
    livePreviewObserver: MutationObserver | undefined;
    resizeObserver: ResizeObserver | undefined;
}

export interface OrphanData {
    units: InteractifyUnit[];
}

export interface IPluginContext {
    leaf: WorkspaceLeaf | undefined;
    view: MarkdownView | undefined;
    leafID: LeafID | undefined;
    active: boolean;
    inPreviewMode: boolean;
    inLivePreviewMode: boolean;
}
