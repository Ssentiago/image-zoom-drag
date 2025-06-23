import { FC, useMemo } from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from 'react-obsidian-setting';

import { createSettingsProxy } from '../../../../../../proxy/settings-proxy';
import { useSettingsContext } from '../../../../../core/SettingsContext';
import { useUnitsManagerContext } from '../../context/UnitsManagerContext';
import { UnitOptionsProps } from './types/interfaces';

export const UnitOptionsModal: FC<UnitOptionsProps> = ({
    unitIndex,
    onClose,
    onChanges,
}) => {
    const { plugin } = useSettingsContext();
    const { units } = useUnitsManagerContext();
    const unit = useMemo(() => units[unitIndex], [unitIndex]);

    return (
        <ReactObsidianModal
            onClose={onClose}
            title={`${unit.name} unit options`}
        >
            <ReactObsidianSetting
                desc={'These settings will only apply to this unit.'}
            />

            <ReactObsidianSetting
                name={'Panels'}
                setHeading={true}
            />

            {Object.entries(unit.panels).map(([panel, { on }]) => (
                <ReactObsidianSetting
                    name={panel
                        .charAt(0)
                        .toUpperCase()
                        .concat(panel.slice(1).toLowerCase())}
                    key={panel}
                    addToggles={[
                        (toggle) => {
                            toggle.setValue(on);
                            toggle.onChange(async (value) => {
                                const oldUnits = createSettingsProxy(
                                    plugin,
                                    JSON.parse(JSON.stringify(units)),
                                    [plugin.settings.events.units.configs]
                                );
                                plugin.settings.data.units.configs[
                                    unitIndex
                                ].panels[panel].on = value;
                                await plugin.settings.saveSettings();

                                onChanges(
                                    oldUnits,
                                    `Turn ${!value ? 'off' : 'on'} panel \`${panel}\` for unit \`${unit.name}\``
                                );
                            });

                            return toggle;
                        },
                    ]}
                />
            ))}
        </ReactObsidianModal>
    );
};
