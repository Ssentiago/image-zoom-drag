import React from 'react';

import { App } from 'obsidian';

import DiagramZoomDragPlugin from '../../../../core/diagram-zoom-drag-plugin';
import { UndoRedoApi } from '../../hooks/types/interfaces';

export interface UndoRedoContextProps<T> extends UndoRedoApi<T> {}

export interface SettingsContextProps {
    plugin: DiagramZoomDragPlugin;
    app: App;
    forceReload: () => void;
    reloadCount: number;
    currentPath: string;
    setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
}

export interface SettingProviderProps {
    app: App;
    plugin: DiagramZoomDragPlugin;
    children: React.ReactNode;
}
