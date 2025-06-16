import { FC } from 'react';

import { ButtonComponent } from 'obsidian';
import { ReactObsidianSetting } from 'react-obsidian-setting';
import { useLocation } from 'react-router-dom';

import { useSettingsContext } from '../../../core/SettingsContext';

const ResetSettings: FC = () => {
    const { plugin, forceReload, setCurrentPath } = useSettingsContext();

    const location = useLocation();

    return (
        <ReactObsidianSetting
            addButtons={[
                (button): ButtonComponent => {
                    button.setIcon('rotate-ccw');
                    button.setTooltip('Reset settings to default');
                    button.onClick(async () => {
                        setCurrentPath(location.pathname);
                        await plugin.settings.resetSettings();
                        plugin.settings.eventBus.emit('settings-reset');
                        forceReload();
                        plugin.showNotice(
                            'Settings have been reset to default.'
                        );
                    });
                    return button;
                },
            ]}
        />
    );
};

export default ResetSettings;
