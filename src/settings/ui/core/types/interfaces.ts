import React from 'react';

import { App } from 'obsidian';

import IzdPlugin from '../../../../core/izd-plugin';
import { UndoRedoApi } from '../../hooks/types/interfaces';

export interface UndoRedoContextProps<T> extends UndoRedoApi<T> {}

export interface SettingsContextProps {
    plugin: IzdPlugin;
    app: App;
    forceReload: () => void;
    reloadCount: number;
    currentPath: string;
    setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
}

export interface SettingProviderProps {
    app: App;
    plugin: IzdPlugin;
    children: React.ReactNode;
}
