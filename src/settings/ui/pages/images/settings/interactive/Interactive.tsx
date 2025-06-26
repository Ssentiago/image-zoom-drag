import { FC, useCallback, useMemo, useState } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { DropdownComponent } from 'obsidian';

import { t } from '../../../../../../lang';
import { ActivationMode } from '../../../../../types/interfaces';
import { useSettingsContext } from '../../../../core/SettingsContext';

const Interactive: FC = () => {
    const { plugin } = useSettingsContext();
    const [isIMOptionEnabled, setIsIMOptionEnabled] = useState(
        plugin.settings.data.units.interactivity.markdown.autoDetect
    );
    const [activationMode, setActivationMode] = useState(
        plugin.settings.data.units.interactivity.markdown.activationMode
    );

    const [activationModeTooltip, setActivationModeTooltip] =
        useState<string>('');

    const activationModeTooltips: Record<ActivationMode, string> = useMemo(
        () => ({
            immediate:
                t.settings.pages.images.settings.interactive.activationMode
                    .tooltips.immediate,
            lazy: t.settings.pages.images.settings.interactive.activationMode
                .tooltips.lazy,
        }),
        []
    );

    const updateActivationModeTooltip = useCallback(
        (dropdown: DropdownComponent) => {
            const selectedValue = dropdown.selectEl.options[
                dropdown.selectEl.options.selectedIndex
            ].value as ActivationMode;

            setActivationModeTooltip(activationModeTooltips[selectedValue]);
        },
        []
    );

    return (
        <>
            <ReactObsidianSetting
                name={t.settings.pages.images.settings.interactive.header}
                setHeading
            />

            <ReactObsidianSetting
                name={
                    t.settings.pages.images.settings.interactive.pickerMode.name
                }
                multiDesc={(m) => {
                    m.addDescriptions(
                        t.settings.pages.images.settings.interactive.pickerMode
                            .desc
                    );
                    return m;
                }}
                toggles={[
                    (t) => {
                        t.setValue(
                            plugin.settings.data.units.interactivity.picker
                                .enabled
                        );
                        t.onChange(async (value) => {
                            plugin.settings.data.units.interactivity.picker.enabled =
                                value;
                            await plugin.settings.saveSettings();
                        });
                        return t;
                    },
                ]}
            />
            <ReactObsidianSetting
                name={
                    t.settings.pages.images.settings.interactive.autoDetect.name
                }
                multiDesc={(m) => {
                    m.addDescriptions(
                        t.settings.pages.images.settings.interactive.autoDetect
                            .desc
                    );
                    return m;
                }}
                toggles={[
                    (toggle) => {
                        toggle.setValue(
                            plugin.settings.data.units.interactivity.markdown
                                .autoDetect
                        );
                        toggle.onChange(async (value) => {
                            setIsIMOptionEnabled(value);
                            plugin.settings.data.units.interactivity.markdown.autoDetect =
                                value;
                            await plugin.settings.saveSettings();
                        });
                        return toggle;
                    },
                ]}
            />

            {isIMOptionEnabled && (
                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.settings.interactive
                            .activationMode.name
                    }
                    desc={
                        t.settings.pages.images.settings.interactive
                            .activationMode.desc
                    }
                    buttons={[
                        (button) => {
                            button.setIcon('message-circle-question');
                            button.setTooltip(activationModeTooltip);
                            return button;
                        },
                    ]}
                    dropdowns={[
                        (dropdown) => {
                            dropdown.addOptions({
                                immediate:
                                    t.settings.pages.images.settings.interactive
                                        .activationMode.dropdown.immediate,
                                lazy: t.settings.pages.images.settings
                                    .interactive.activationMode.dropdown.lazy,
                            });
                            dropdown.setValue(
                                plugin.settings.data.units.interactivity
                                    .markdown.activationMode
                            );
                            updateActivationModeTooltip(dropdown);
                            dropdown.onChange(async (value) => {
                                const mode = value as ActivationMode;

                                setActivationMode(mode);
                                plugin.settings.data.units.interactivity.markdown.activationMode =
                                    mode;
                                await plugin.settings.saveSettings();
                                updateActivationModeTooltip(dropdown);
                            });

                            return dropdown;
                        },
                    ]}
                />
            )}
        </>
    );
};

export default Interactive;
