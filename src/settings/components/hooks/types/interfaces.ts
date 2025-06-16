export interface HistoryAction<T> {
    state: T;
    description: string;
}

export interface UndoRedoApi<T> {
    updateUndoStack: (state: T, description: string) => void;
    undo: () => Promise<void>;
    redo: () => Promise<void>;
    canUndo: boolean;
    canRedo: boolean;
    getRedoLabel: () => string;
    getUndoLabel: () => string;
}
