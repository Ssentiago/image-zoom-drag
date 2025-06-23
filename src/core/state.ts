import { FileStats } from 'obsidian';

import { DiagramAdapters } from '../adapters/types/constants';
import InteractiveElement from '../diagram/interactiveElement';
import DiagramZoomDragPlugin from './diagram-zoom-drag-plugin';
import { LeafID } from './types/definitions';
import { Data, OrphanData } from './types/interfaces';

export default class State {
    data = new Map<LeafID, Data>();
    orphans: OrphanData = { diagrams: [] };

    constructor(private readonly plugin: DiagramZoomDragPlugin) {}

    /**
     * Initializes the data for a leaf with the given id if it doesn't exist.
     *
     * @param leafID The id of the leaf to initialize.
     */
    initializeLeaf(leafID: LeafID): void {
        if (!this.data.get(leafID)) {
            this.data.set(leafID, {
                diagrams: [],
                livePreviewObserver: undefined,
            });
            this.plugin.logger.debug(
                `Initialized data for leaf width id: ${leafID}...`
            );
        }
    }

    /**
     * Cleans up all resources associated with a given leaf.
     *
     * This method unloads all diagrams and disconnects the live preview observer
     * associated with the specified leafID. It then removes the leaf's data from
     * the state. If no data is found for the given leafID, an error is logged.
     *
     * @param leafID - The ID of the leaf to clean up.
     */
    async cleanupLeaf(leafID: LeafID): Promise<void> {
        const data = this.data.get(leafID);
        if (!data) {
            this.plugin.logger.error(`No data for leaf`, { leafID });
            return;
        }
        data.livePreviewObserver?.disconnect();
        data.livePreviewObserver = undefined;

        for (const diagram of data.diagrams) {
            await diagram.onDelete();
            this.plugin.logger.debug(`Unloaded diagram`, {
                diagramName: diagram.context.options.name,
            });
        }

        this.data.delete(leafID);
        this.plugin.logger.debug(
            `Data for leaf with id ${leafID} was cleaned successfully.`
        );
    }

    /**
     * Clears the state of all registered leaves.
     *
     * This method will call {@link cleanupLeaf} for each registered leaf, which
     * will unload all diagrams and disconnect the live preview observer
     * associated with the specified leaf. It then removes the leaf's data from
     * the state.
     *
     * It is important to note that this method will not remove the data from the
     * state if no data is found for the given leafID. An error will be logged in
     * that case.
     */
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
    hasObserver(leafID: LeafID): boolean {
        return !!this.getLivePreviewObserver(leafID);
    }

    /**
     * Retrieves the diagrams associated with the specified leaf.
     *
     * This method will return all diagrams that have been associated with the
     * given leaf. If no data exists for the given leaf, an empty array is
     * returned instead.
     *
     * @param leafID - The ID of the leaf for which to retrieve diagrams.
     * @returns An array of Diagram objects associated with the given leaf, or an
     * empty array if no data exists for the given leaf.
     */
    getDiagrams(leafID: LeafID): InteractiveElement[] {
        return this.data.get(leafID)?.diagrams ?? [];
    }

    /**
     * Pushes a diagram to the state for the given leaf.
     *
     * This method adds a diagram to the array of diagrams associated with the
     * given leafID. If no data exists for the given leaf, an error is logged and
     * the method does nothing.
     *
     * @param leafID - The ID of the leaf for which to push the diagram.
     * @param diagram - The Diagram to push to the state.
     */
    pushDiagram(leafID: LeafID, diagram: InteractiveElement): void {
        const data = this.data.get(leafID);
        if (!data) {
            this.plugin.logger.error(`No data for leafID: ${leafID}`);
            return;
        }
        data.diagrams.push(diagram);
    }

    pushOrphanDiagram(diagram: InteractiveElement): void {
        this.orphans.diagrams.push(diagram);
    }

    async cleanOrphan() {
        for (const diagram of this.orphans.diagrams) {
            await diagram.onDelete();
        }
    }

    async cleanupDiagramsOnFileChange(
        leafID: LeafID,
        currentFileStats: FileStats
    ): Promise<void> {
        const data = this.data.get(leafID);
        if (!data) {
            this.plugin.logger.error(`No data for leafID: ${leafID}`);
            return;
        }

        const currentFileCtime = currentFileStats.ctime;

        const diagramsToKeep = [];
        for (const diagram of data.diagrams) {
            if (
                diagram.context.adapter === DiagramAdapters.PickerModeAdapter ||
                currentFileCtime !== diagram.fileStats.ctime
            ) {
                await diagram.onDelete();
                this.plugin.logger.debug(
                    `Cleaned up diagram with id ${diagram.id} due to file change`
                );
            } else {
                diagramsToKeep.push(diagram);
            }
        }
        data.diagrams = diagramsToKeep;
    }
}
