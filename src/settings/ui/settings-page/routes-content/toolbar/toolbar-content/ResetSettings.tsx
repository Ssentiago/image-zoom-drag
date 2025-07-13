import { t } from '@/lang';

import { FC, useCallback } from 'react';

import { RotateCcw } from 'lucide-react';
import { useLocation } from 'wouter';

import { useSettingsContext } from '../../../../core/SettingsContext';

const ResetSettings: FC = () => {
    const { plugin, forceReload, setCurrentPath } = useSettingsContext();

    const [location, setLocation] = useLocation();

    const resetAction = useCallback(async () => {
        setCurrentPath(location);
        await plugin.settings.reset();
        plugin.settings.emitter.emit('settings-reset', {
            eventName: 'settings-reset',
            oldValue: undefined,
            newValue: undefined,
        });
        forceReload();
        plugin.showNotice(t.settings.toolbar.reset.notice);
    }, [plugin, forceReload, setCurrentPath, location]);

    return (
        <button
            aria-label={t.settings.toolbar.reset.tooltip}
            onClick={resetAction}
        >
            <RotateCcw size={18} />
        </button>
    );
};

export default ResetSettings;
