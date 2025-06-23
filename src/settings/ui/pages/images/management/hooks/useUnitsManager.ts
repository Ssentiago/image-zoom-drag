import { useCallback, useEffect, useState } from 'react';

import { UnitConfig } from '../../../../../types/interfaces';
import { useSettingsContext } from '../../../../core/SettingsContext';

export const useUnitsManager = () => {
    const { plugin } = useSettingsContext();
    const [units, setUnits] = useState(plugin.settings.data.units.configs);

    useEffect(() => {
        const handler = () => {
            setUnits(plugin.settings.data.units.configs);
        };

        plugin.settings.eventBus.on(
            plugin.settings.events.units.configs.$path,
            handler
        );
        return () => {
            plugin.settings.eventBus.off(
                plugin.settings.events.units.configs.$path,
                handler
            );
        };
    }, [plugin]);

    const saveUnits = useCallback(
        async (newUnits: UnitConfig[]) => {
            setUnits(newUnits);
            plugin.settings.data.units.configs = newUnits;
            await plugin.settings.saveSettings();
        },
        [plugin]
    );

    return { units, saveUnits };
};
