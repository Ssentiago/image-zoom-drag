import React from 'react';

import { App } from 'obsidian';
import { SettingProvider } from './core/context';
import DiagramZoomDragPlugin from '../../core/diagram-zoom-drag-plugin';
import SettingsPage from './settings-page/SettingsPage';
import styled, { keyframes } from 'styled-components';

const fadeInSlide = keyframes`
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const SettingsContainer = styled.div`
    animation: ${fadeInSlide} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;
/**
 * The root component of the settings UI.
 *
 * This component is responsible for rendering the settings page. It also provides
 * a context for the settings page to access the app and the plugin.
 *
 * @param app The Obsidian app instance.
 * @param plugin The instance of the DiagramZoomDragPlugin.
 */
const Application: React.FC<{
    app: App;
    plugin: DiagramZoomDragPlugin;
}> = ({ app, plugin }) => (
    <SettingProvider app={app} plugin={plugin}>
        <SettingsContainer>
            <SettingsPage />
        </SettingsContainer>
    </SettingProvider>
);

export default Application;
