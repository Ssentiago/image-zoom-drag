import { FC, useMemo } from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from 'react-obsidian-setting';

import { createSettingsProxy } from '../../../../../../proxy/settings-proxy';
import { useSettingsContext } from '../../../../../core/SettingsContext';
import { useDiagramManagerContext } from '../../context/DiagramManagerContext';
import { DiagramOptionsProps } from './types/interfaces';

export const DiagramOptionsModal: FC<DiagramOptionsProps> = ({
    diagramIndex,
    onClose,
    onChanges,
}) => {
    const { plugin } = useSettingsContext();
    const { diagrams } = useDiagramManagerContext();
    const diagram = useMemo(() => diagrams[diagramIndex], [diagramIndex]);

    return (
        <ReactObsidianModal
            onClose={onClose}
            title={`${diagram.name}\ diagram options`}
        >
            <ReactObsidianSetting
                desc={'These settings will only apply to this diagram.'}
            />

            <ReactObsidianSetting
                name={'Panels'}
                setHeading={true}
            />

            {Object.entries(diagram.panels).map(([panel, { on }]) => (
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
                                const oldDiagrams = createSettingsProxy(
                                    plugin,
                                    JSON.parse(JSON.stringify(diagrams)),
                                    ['supported_diagrams']
                                );
                                plugin.settings.data.diagrams.supported_diagrams[
                                    diagramIndex
                                ].panels[panel].on = value;
                                await plugin.settings.saveSettings();

                                onChanges(
                                    oldDiagrams,
                                    `Turn ${!value ? 'off' : 'on'} panel \`${panel}\` for diagram \`${diagram.name}\``
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
