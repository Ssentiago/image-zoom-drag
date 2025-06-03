import React from 'react';
import { useSettingsContext } from '../../../../../../core/context';
import { ReactObsidianSetting } from 'react-obsidian-setting';
import { ToggleComponent } from 'obsidian';

const DiagramFolding = () => {
  const {plugin} = useSettingsContext()
    return <>
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
    </>
}

export default DiagramFolding
