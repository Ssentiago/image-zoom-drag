import { FileStats } from 'obsidian';

import { InteractifyAdapters } from '../adapters/types/constants';
import InteractifyUnit from '../interactify-unit/interactify-unit';
import InteractifyPlugin from './interactify-plugin';
import { LeafID } from './types/definitions';
import { Data, OrphanData } from './types/interfaces';

export default class State {
    data = new Map<LeafID, Data>();
    orphans: OrphanData = { units: [] };

    constructor(private readonly plugin: InteractifyPlugin) {}

    /**
     * Initializes the data for a leaf with the given id if it doesn't exist.
     *
     * @param leafID The id of the leaf to initialize.
     */
    initializeLeaf(leafID: LeafID): void {
        if (!this.data.get(leafID)) {
            this.data.set(leafID, {
                units: [],
                livePreviewObserver: undefined,
                resizeObserver: undefined,
            });
            this.plugin.logger.debug(
                `Initialized data for leaf width id: ${leafID}...`
            );
        }
    }

    async cleanupLeaf(leafID: LeafID): Promise<void> {
        const data = this.data.get(leafID);
        if (!data) {
            this.plugin.logger.error(`No data for leaf`, { leafID });
            return;
        }
        data.livePreviewObserver?.disconnect();
        data.livePreviewObserver = undefined;
        data.resizeObserver?.disconnect();
        data.resizeObserver = undefined;

        for (const unit of data.units) {
            await unit.onDelete();
            this.plugin.logger.debug(`Unloaded unit`, {
                unitName: unit.context.options.name,
            });
        }

        this.data.delete(leafID);
        this.plugin.logger.debug(
            `Data for leaf with id ${leafID} was cleaned successfully.`
        );
    }

    async clear(): Promise<void> {
        this.plugin.logger.debug('Started to clear state...');
        for (const leafID of this.data.keys()) {
            await this.cleanupLeaf(leafID);
        }

        await this.cleanOrphan();

        this.plugin.logger.debug('State was cleared successfully.');
    }

    /**
     * Retrieves the live preview observer associated with the specified leaf.
     *
     * @param leafID - The ID of the leaf for which to retrieve the observer.
     * @returns The MutationObserver associated with the leaf, or `undefined` if none exists.
     */
    getLivePreviewObserver(leafID: LeafID): MutationObserver | undefined {
        return this.data.get(leafID)?.livePreviewObserver;
    }

    /**
     * Sets the live preview observer associated with the specified leaf.
     *
     * If the state has a data entry associated with the specified leafID, it will
     * set the livePreviewObserver property of that data entry to the specified
     * observer. If no data is found for the given leafID, this method does
     * nothing.
     *
     * @param leafID - The ID of the leaf for which to set the observer.
     * @param observer - The MutationObserver to associate with the leaf.
     */
    setLivePreviewObserver(leafID: LeafID, observer: MutationObserver): void {
        const data = this.data.get(leafID);
        if (data) {
            data.livePreviewObserver = observer;
        }
    }

    /**
     * Checks if there is a live preview observer associated with the specified leaf.
     *
     * This method determines whether a live preview observer has been set for
     * the given leafID by attempting to retrieve it.
     *
     * @param leafID - The ID of the leaf to check for an associated observer.
     * @returns `true` if a live preview observer exists for the leaf, `false` otherwise.
     */
    hasLiveObserver(leafID: LeafID): boolean {
        return !!this.getLivePreviewObserver(leafID);
    }

    getResizeObserver(leafID: LeafID): ResizeObserver | undefined {
        return this.data.get(leafID)?.resizeObserver;
    }

    setResizeObserver(leafID: LeafID, observer: ResizeObserver) {
        const data = this.data.get(leafID);
        if (data) {
            data.resizeObserver = observer;
        }
    }
    hasResizeObserver(leafID: LeafID): boolean {
        return !!this.getResizeObserver(leafID);
    }

    getUnits(leafID: LeafID): InteractifyUnit[] {
        return this.data.get(leafID)?.units ?? [];
    }

    pushUnit(leafID: LeafID, unit: InteractifyUnit): void {
        const data = this.data.get(leafID);
        if (!data) {
            this.plugin.logger.error(`No data for leafID: ${leafID}`);
            return;
        }
        data.units.push(unit);
    }

    pushOrphanUnit(unit: InteractifyUnit): void {
        this.orphans.units.push(unit);
    }

    async cleanOrphan() {
        for (const unit of this.orphans.units) {
            await unit.onDelete();
        }
    }

    async cleanupUnitsOnFileChange(
        leafID: LeafID,
        currentFileStats: FileStats
    ): Promise<void> {
        const data = this.data.get(leafID);
        if (!data) {
            this.plugin.logger.error(`No data for leafID: ${leafID}`);
            return;
        }

        const currentFileCtime = currentFileStats.ctime;

        const unitsToKeep = [];
        for (const unit of data.units) {
            if (
                unit.context.adapter === InteractifyAdapters.PickerMode ||
                currentFileCtime !== unit.fileStats.ctime
            ) {
                await unit.onDelete();
                this.plugin.logger.debug(
                    `Cleaned up unit with id ${unit.id} due to file change`
                );
            } else {
                unitsToKeep.push(unit);
            }
        }
        data.units = unitsToKeep;
    }
}
