import { t } from '@/lang';

import React, { FC } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { ToggleComponent } from 'obsidian';

import { useSettingsContext } from '../../../../core/SettingsContext';

const Folding: FC = (): React.ReactElement => {
    const { plugin } = useSettingsContext();
    return (
        <>
            <ReactObsidianSetting
                name={t.settings.pages.images.general.fold.header}
                setHeading={true}
            />

            <ReactObsidianSetting
                name={t.settings.pages.images.general.fold.foldByDefault.name}
                toggles={[
                    (toggle): ToggleComponent => {
                        toggle
                            .setValue(
                                plugin.settings.$.units.folding.foldByDefault
                            )
                            .onChange(async (value: boolean) => {
                                plugin.settings.$.units.folding.foldByDefault =
                                    value;
                                await plugin.settings.save();
                            });
                        return toggle;
                    },
                ]}
            />

            <ReactObsidianSetting
                name={
                    t.settings.pages.images.general.fold.autoFoldOnFocusChange
                        .name
                }
                toggles={[
                    (toggle): ToggleComponent => {
                        toggle
                            .setValue(
                                plugin.settings.$.units.folding
                                    .autoFoldOnFocusChange
                            )
                            .onChange(async (value: boolean) => {
                                plugin.settings.$.units.folding.autoFoldOnFocusChange =
                                    value;
                                await plugin.settings.save();
                            });
                        return toggle;
                    },
                ]}
            />
        </>
    );
};

export default Folding;
