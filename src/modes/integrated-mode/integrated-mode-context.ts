import IntegratedMode from '@/modes/integrated-mode/integrated-mode';

import { MarkdownView, WorkspaceLeaf } from 'obsidian';

import { LeafID } from './types/definitions';

export class IntegratedModeContext {
    leaf: WorkspaceLeaf | undefined;
    view: MarkdownView | undefined;

    constructor(private readonly integratedMode: IntegratedMode) {}

    get leafID(): undefined | LeafID {
        return this.leaf && (this.leaf.id as LeafID);
    }

    /**
     * Whether the context is active.
     *
     * The context is active if:
     * 1. The context is associated with a leaf.
     * 2. The context is associated with a view.
     * 3. The view is associated with a file.
     *
     * @readonly
     */
    get active(): boolean {
        return (
            this.leaf !== undefined &&
            this.view !== undefined &&
            this.view.file !== null
        );
    }

    /**
     * Checks if the current view is in preview mode.
     */
    get inPreviewMode(): boolean {
        const viewState = this.view?.getState();
        return viewState?.mode === 'preview';
    }

    /**
     * Checks if the current view is in live preview mode.
     */
    get inLivePreviewMode(): boolean {
        const viewState = this.view?.getState();
        return !viewState?.source && viewState?.mode === 'source';
    }

    /**
     * Initializes the view context with the currently active view.
     */
    initialize(onInitialize: (leafID: LeafID) => void): void {
        const view =
            this.integratedMode.plugin.app.workspace.getActiveViewOfType(
                MarkdownView
            );
        if (!view) {
            return;
        }
        this.leaf = view.leaf;
        this.view = view;

        onInitialize(this.leafID!);
    }

    /**
     * Cleans up the view context if the leaf is no longer alive.
     */
    cleanup(onCleanup: (leafID: LeafID) => void): void {
        if (!this.leaf) {
            return;
        }

        const isLeafAlive =
            this.integratedMode.plugin.app.workspace.getLeafById(this.leafID!);
        if (isLeafAlive === null) {
            onCleanup(this.leafID!);
            this.view = undefined;
            this.leaf = undefined;
        }
    }

    getAvailableSize(): { width: number; height: number } {
        if (!this.active) {
            return { width: 0, height: 0 };
        }

        const selector = this.inPreviewMode
            ? '.markdown-preview-view'
            : '.markdown-source-view';

        const container = this.view!.contentEl.querySelector(selector);
        if (!container) {
            return { width: 0, height: 0 };
        }

        const sizer = container.querySelector(
            '.markdown-preview-sizer, .cm-sizer'
        );
        const marginLeft = sizer
            ? parseInt(window.getComputedStyle(sizer).marginLeft) || 0
            : 0;

        return {
            width: container.clientWidth * 0.9 - marginLeft,
            height: container.clientHeight * 0.9,
        };
    }
}
