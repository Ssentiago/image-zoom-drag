import { t } from '@/lang';

import { FC, useCallback, useMemo, useState } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { DropdownComponent } from 'obsidian';

import { ActivationMode } from '../../../../../types/interfaces';
import { useSettingsContext } from '../../../../core/SettingsContext';

const Interactive: FC = () => {
    const { plugin } = useSettingsContext();
    const [isIMOptionEnabled, setIsIMOptionEnabled] = useState(
        plugin.settings.$.units.interactivity.markdown.autoDetect
    );
    const [activationMode, setActivationMode] = useState(
        plugin.settings.$.units.interactivity.markdown.activationMode
    );

    const [activationModeTooltip, setActivationModeTooltip] =
        useState<string>('');

    const activationModeTooltips: Record<ActivationMode, string> = useMemo(
        () => ({
            immediate:
                t.settings.pages.images.general.interactive.activationMode
                    .tooltips.immediate,
            lazy: t.settings.pages.images.general.interactive.activationMode
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
                name={t.settings.pages.images.general.interactive.header}
                setHeading
            />

            <ReactObsidianSetting
                name={
                    t.settings.pages.images.general.interactive.pickerMode.name
                }
                multiDesc={(m) => {
                    m.addDescriptions(
                        t.settings.pages.images.general.interactive.pickerMode
                            .desc
                    );
                    return m;
                }}
                toggles={[
                    (toggle) => {
                        toggle.setValue(
                            plugin.settings.$.units.interactivity.picker.enabled
                        );
                        toggle.onChange(async (value) => {
                            plugin.settings.$.units.interactivity.picker.enabled =
                                value;
                            await plugin.settings.save();
                        });
                        return toggle;
                    },
                ]}
            />
            <ReactObsidianSetting
                name={
                    t.settings.pages.images.general.interactive.autoDetect.name
                }
                multiDesc={(m) => {
                    m.addDescriptions(
                        t.settings.pages.images.general.interactive.autoDetect
                            .desc
                    );
                    return m;
                }}
                toggles={[
                    (toggle) => {
                        toggle.setValue(
                            plugin.settings.$.units.interactivity.markdown
                                .autoDetect
                        );
                        toggle.onChange(async (value) => {
                            setIsIMOptionEnabled(value);
                            plugin.settings.$.units.interactivity.markdown.autoDetect =
                                value;
                            await plugin.settings.save();
                        });
                        return toggle;
                    },
                ]}
            />

            {isIMOptionEnabled && (
                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.general.interactive
                            .activationMode.name
                    }
                    desc={
                        t.settings.pages.images.general.interactive
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
                                    t.settings.pages.images.general.interactive
                                        .activationMode.dropdown.immediate,
                                lazy: t.settings.pages.images.general
                                    .interactive.activationMode.dropdown.lazy,
                            });
                            dropdown.setValue(
                                plugin.settings.$.units.interactivity.markdown
                                    .activationMode
                            );
                            updateActivationModeTooltip(dropdown);
                            dropdown.onChange(async (value) => {
                                const mode = value as ActivationMode;

                                setActivationMode(mode);
                                plugin.settings.$.units.interactivity.markdown.activationMode =
                                    mode;
                                await plugin.settings.save();
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
