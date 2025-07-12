import InteractifyPlugin from '@/core/interactify-plugin';

import { Component, MarkdownView } from 'obsidian';

import { LeafIndexData } from '../types/interfaces';
import { BaseUnitContext } from '../types/interfaces';
import { LeafContext } from '../types/interfaces';
import ImageIndexer from './image-indexer';

export default class LeafIndex extends Component {
    data: Map<string, LeafIndexData> = new Map();
    activeLeafContext: LeafContext | undefined;

    constructor(readonly plugin: InteractifyPlugin) {
        super();
        this.load();
        this.setupObsidianEventHandlers();
    }

    /**
     *
     */
    private setupObsidianEventHandlers() {
        this.plugin.app.workspace.on('layout-change', async () => {
            await this.updateIndex();
        });
        this.plugin.app.workspace.on('active-leaf-change', async () => {
            await this.updateIndex();
        });
    }

    private async updateIndex() {
        await this.cleanupActiveLeaf();
        await this.initializeActiveLeaf();
        await this.setupImageIndexer();
    }

    private async setupImageIndexer() {
        if (!this.activeLeafContext?.id) {
            return;
        }
        const data = this.data.get(this.activeLeafContext.id);
        if (!data) {
            return;
        }

        if (data.indexer) {
            return;
        }

        data.indexer = new ImageIndexer(this);
        data.indexer?.enable();
    }

    async onunload() {
        for (const leafID of this.data.keys()) {
            await this.cleanupLeafData(leafID);
        }
    }

    private async initializeActiveLeaf() {
        const view =
            this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) {
            return;
        }

        this.activeLeafContext = {
            id: view.leaf.id,
            view,
        };

        this.initializeLeafData(this.activeLeafContext);
    }

    private async cleanupActiveLeaf() {
        if (!this.activeLeafContext?.id) {
            return;
        }

        const isLeafAlive = this.plugin.app.workspace.getLeafById(
            this.activeLeafContext.id
        );
        if (isLeafAlive === null) {
            await this.cleanupLeafData(this.activeLeafContext.id);
            this.activeLeafContext = undefined;
        }
    }

    private initializeLeafData(leafContext: LeafContext): void {
        if (!this.data.get(leafContext.id)) {
            this.data.set(leafContext.id, {
                imageIndex: new Map(),
                indexer: undefined,
            });
            this.plugin.logger.debug(
                `Initialized data for leaf width id: ${leafContext.id}...`
            );
        }
    }

    private async cleanupLeafData(leafID: string): Promise<void> {
        const data = this.data.get(leafID);
        if (!data) {
            this.plugin.logger.error(`No data for leaf`, {
                leafID,
            });
            return;
        }

        this.data.delete(leafID);
        this.plugin.logger.debug(
            `Data for leaf with id ${leafID} was cleaned successfully.`
        );
    }

    private finalizeElementContext(
        ctx: Partial<BaseUnitContext>
    ): BaseUnitContext | undefined {
        if (
            !ctx.element ||
            !ctx.elementType ||
            !ctx.origin ||
            !ctx.mode ||
            !ctx.sourceData
        ) {
            return undefined;
        }
        return ctx as BaseUnitContext;
    }

    pushImageContext(imageData: Partial<BaseUnitContext>): void {
        if (!this.activeLeafContext) {
            return;
        }

        const elementCtx = this.finalizeElementContext(imageData);
        if (!elementCtx) {
            this.plugin.logger.warn(
                'Invalid image context data, cannot push to index.'
            );
            return;
        }

        const data = this.data.get(this.activeLeafContext.id);
        if (!data) return;

        if (!data.imageIndex.get(elementCtx.element)) {
            data.imageIndex.set(elementCtx.element, elementCtx);
            this.plugin.emitter.emit('leaf-index.image.added', elementCtx);
        }
    }
}
