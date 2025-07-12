import { t, tf } from '@/lang';

import { FC, useMemo } from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from '@obsidian-devkit/native-react-components';

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

    return (
        <ReactObsidianModal
            onClose={onClose}
            title={tf(
                t.settings.pages.images.presets.availableImageConfigs
                    .optionsModal.name,
                { name: unit.name }
            )}
        >
            <ReactObsidianSetting
                desc={
                    t.settings.pages.images.presets.availableImageConfigs
                        .optionsModal.desc
                }
            />

            <ReactObsidianSetting
                name={
                    t.settings.pages.images.presets.availableImageConfigs
                        .optionsModal.panels.header
                }
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
                                plugin.settings.$.units.configs[
                                    unitIndex
                                ].panels[panel].on = value;
                                await plugin.settings.save();
                                const state = value
                                    ? t.settings.pages.images.presets
                                          .availableImageConfigs.optionsModal
                                          .panels.states.on
                                    : t.settings.pages.images.presets
                                          .availableImageConfigs.optionsModal
                                          .panels.states.off;
                                onChanges(
                                    oldUnits,
                                    tf(
                                        t.settings.pages.images.presets
                                            .availableImageConfigs.optionsModal
                                            .panels.action,
                                        {
                                            state: state,
                                            panel: panel,
                                            name: unit.name,
                                        }
                                    )
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
