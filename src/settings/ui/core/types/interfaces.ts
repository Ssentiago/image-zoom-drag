import React from 'react';

import { App } from 'obsidian';

import InteractifyPlugin from '../../../../core/interactify-plugin';
import { UndoRedoApi } from '../../hooks/types/interfaces';

export interface UndoRedoContextProps<T> extends UndoRedoApi<T> {}

export interface SettingsContextProps {
    plugin: InteractifyPlugin;
    app: App;
    forceReload: () => void;
    reloadCount: number;
    currentPath: string;
    setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
}

export interface SettingProviderProps {
    app: App;
    plugin: InteractifyPlugin;
    children: React.ReactNode;
}
