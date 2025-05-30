import React from 'react';
import { ReactObsidianSetting } from 'react-obsidian-setting';
import { useSettingsContext } from '../../../../core/context';
import DiagramSize from './components/diagram-size/diagram-size';
import { ToggleComponent } from 'obsidian';

/**
 * A React component that renders a settings page for diagrams.
 *
 * This component uses `ReactObsidianSetting` to create toggles for folding
 * diagrams by default and for automatically folding diagrams on focus change.
 *
 * It also renders a component for setting the size of the diagram.
 *
 * @returns A React element for the settings page.
 */
const DiagramsSettings: React.FC = (): React.ReactElement => {
    const { plugin } = useSettingsContext();

    return (
        <>
            <ReactObsidianSetting name={'Fold'} setHeading={true} />

            <ReactObsidianSetting
                name="Fold diagrams by default?"
                addToggles={[
                    (toggle): ToggleComponent => {
                        toggle
                            .setValue(plugin.settings.foldByDefault)
                            .onChange(async (value: boolean) => {
                                plugin.settings.foldByDefault = value;
                                await plugin.settingsManager.saveSettings();
                            });
                        return toggle;
                    },
                ]}
            />

            <ReactObsidianSetting
                name="Automatically fold diagrams on focus change?"
                addToggles={[
                    (toggle): ToggleComponent => {
                        toggle
                            .setValue(
                                plugin.settings.automaticFoldingOnFocusChange
                            )
                            .onChange(async (value: boolean) => {
                                plugin.settings.automaticFoldingOnFocusChange =
                                    value;
                                await plugin.settingsManager.saveSettings();
                            });
                        return toggle;
                    },
                ]}
            />
            <DiagramSize />
        </>
    );
};

export default DiagramsSettings;
