import { MarkdownView, WorkspaceLeaf } from 'obsidian';
import { LeafID } from '../diagram/state/typing/types';

interface IPluginContext {
    leaf: WorkspaceLeaf | undefined;
    view: MarkdownView | undefined;
    leafID: LeafID | undefined;
}

export class PluginContext implements IPluginContext {
    leaf: WorkspaceLeaf | undefined;
    view: MarkdownView | undefined;

    get leafID(): undefined | string {
        return this.leaf && (this.leaf.id as LeafID);
    }

    get isValid(): boolean {
        return this.leaf !== undefined && this.view !== undefined;
    }
}
