import React from 'react';

import { App } from 'obsidian';

import IzdPlugin from '../../core/izd-plugin';
import { SettingProvider } from './core/SettingsContext';
import SettingsPage from './settings-page/SettingsPage';

const SettingsRoot: React.FC<{
    app: App;
    plugin: IzdPlugin;
}> = ({ app, plugin }) => (
    <SettingProvider
        app={app}
        plugin={plugin}
    >
        <SettingsPage />
    </SettingProvider>
);

export default SettingsRoot;
