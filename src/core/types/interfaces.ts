import { MarkdownView, WorkspaceLeaf } from 'obsidian';

import Diagram from '../../diagram/diagram';
import { LeafID } from './definitions';

export interface Data {
    diagrams: Diagram[];
    livePreviewObserver: MutationObserver | undefined;
}

export interface IPluginContext {
    leaf: WorkspaceLeaf | undefined;
    view: MarkdownView | undefined;
    leafID: LeafID | undefined;
    active: boolean;
    inPreviewMode: boolean;
    inLivePreviewMode: boolean;
}
