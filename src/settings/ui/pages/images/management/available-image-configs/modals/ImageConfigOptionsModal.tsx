import { FC, useMemo } from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from '@obsidian-devkit/native-react-components';

import { t } from '../../../../../../../lang';
import { useSettingsContext } from '../../../../../core/SettingsContext';
import { useUnitsManagerContext } from '../../context/UnitsManagerContext';
import { UnitOptionsProps } from './types/interfaces';

export const ImageConfigOptionsModal: FC<UnitOptionsProps> = ({
    unitIndex,
    onClose,
    onChanges,
}) => {
    const { plugin } = useSettingsContext();
    const { units } = useUnitsManagerContext();
    const unit = useMemo(() => units[unitIndex], [unitIndex]);
    const opT = useMemo(
        () =>
            t.settings.pages.images.management.availableImageConfigs
                .optionsModal,
        [plugin]
    );
    return (
        <ReactObsidianModal
            onClose={onClose}
            title={opT.name.$format({ name: unit.name })}
        >
            <ReactObsidianSetting desc={opT.desc} />

            <ReactObsidianSetting
                name={opT.panels.header}
                setHeading={true}
            />

            {Object.entries(unit.panels).map(([panel, { on }]) => (
                <ReactObsidianSetting
                    name={panel
                        .charAt(0)
                        .toUpperCase()
                        .concat(panel.slice(1).toLowerCase())}
                    key={panel}
                    toggles={[
                        (toggle) => {
                            toggle.setValue(on);
                            toggle.onChange(async (value) => {
                                const oldUnits = JSON.parse(
                                    JSON.stringify(units)
                                );
                                plugin.settings.data.units.configs[
                                    unitIndex
                                ].panels[panel].on = value;
                                await plugin.settings.saveSettings();
                                const state = value
                                    ? opT.panels.states.on
                                    : opT.panels.states.off;
                                onChanges(
                                    oldUnits,
                                    opT.panels.action.$format({
                                        state: state,
                                        panel: panel,
                                        name: unit.name,
                                    })
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
