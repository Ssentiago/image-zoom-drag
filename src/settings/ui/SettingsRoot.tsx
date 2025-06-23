import React from 'react';

import { App } from 'obsidian';

import InteractifyPlugin from '../../core/interactify-plugin';
import { SettingProvider } from './core/SettingsContext';
import SettingsPage from './settings-page/SettingsPage';

const SettingsRoot: React.FC<{
    app: App;
    plugin: InteractifyPlugin;
}> = ({ app, plugin }) => (
    <SettingProvider
        app={app}
        plugin={plugin}
    >
        <SettingsPage />
    </SettingProvider>
);

export default SettingsRoot;
