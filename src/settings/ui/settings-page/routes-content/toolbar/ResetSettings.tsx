import { FC } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { ButtonComponent } from 'obsidian';
import { useLocation } from 'react-router-dom';

import { t } from '../../../../../lang';
import { useSettingsContext } from '../../../core/SettingsContext';

const ResetSettings: FC = () => {
    const { plugin, forceReload, setCurrentPath } = useSettingsContext();

    const location = useLocation();

    return (
        <ReactObsidianSetting
            buttons={[
                (button): ButtonComponent => {
                    button.setIcon('rotate-ccw');
                    button.setTooltip('Reset settings to default');
                    button.onClick(async () => {
                        setCurrentPath(location.pathname);
                        await plugin.settings.resetSettings();
                        plugin.settings.eventBus.emit('settings-reset', {
                            eventName: 'settings-reset',
                            oldValue: undefined,
                            newValue: undefined,
                        });
                        forceReload();
                        plugin.showNotice(t.settings.notice.resetSettings);
                    });
                    return button;
                },
            ]}
        />
    );
};

export default ResetSettings;
