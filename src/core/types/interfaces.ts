import { MarkdownView, WorkspaceLeaf } from 'obsidian';

import InteractiveElement from '../../diagram/interactiveElement';
import { LeafID } from './definitions';

export interface Data {
    diagrams: InteractiveElement[];
    livePreviewObserver: MutationObserver | undefined;
}

export interface OrphanData {
    diagrams: InteractiveElement[];
}

export interface IPluginContext {
    leaf: WorkspaceLeaf | undefined;
    view: MarkdownView | undefined;
    leafID: LeafID | undefined;
    active: boolean;
    inPreviewMode: boolean;
    inLivePreviewMode: boolean;
}
