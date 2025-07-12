import { useSettingsContext } from '@/settings/ui/core/SettingsContext';

import { FC } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';

const ContextMenu: FC = () => {
    const { plugin } = useSettingsContext();

    return (
        <>
            <ReactObsidianSetting
                name='Context menu'
                setHeading
            />
            <ReactObsidianSetting
                name='Show context menu for diagrams'
                desc='Toggle whether to show context menu for diagrams (svg and img generated from the codeblock)'
                toggles={[
                    (toggle) => {
                        toggle.setValue(
                            plugin.settings.$.units.contextMenu.showForDiagrams
                        );
                        toggle.onChange(async (value) => {
                            plugin.settings.$.units.contextMenu.showForDiagrams =
                                value;
                            await plugin.settings.save();
                        });
                    },
                ]}
            />
            <ReactObsidianSetting
                name='Show context menu for other images'
                desc='Toggle whether to show context menu for other images elements (i.e. local or external)'
                toggles={[
                    (toggle) => {
                        toggle.setValue(
                            plugin.settings.$.units.contextMenu
                                .showForOtherImages
                        );
                        toggle.onChange(async (value) => {
                            plugin.settings.$.units.contextMenu.showForOtherImages =
                                value;
                            await plugin.settings.save();
                        });
                    },
                ]}
            />
        </>
    );
};

export default ContextMenu;
