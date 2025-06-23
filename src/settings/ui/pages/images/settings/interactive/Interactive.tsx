import { FC, useCallback, useMemo, useState } from 'react';

import { DropdownComponent } from 'obsidian';
import { ReactObsidianSetting } from 'react-obsidian-setting';

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
                'Images become interactive instantly when detected. Best for small notes.',
            lazy: 'Images become interactive only when scrolled into view. Best for notes with many images.',
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
                name={'Interactivity options'}
                setHeading
            />

            <ReactObsidianSetting
                name={'Enable picker mode'}
                addMultiDesc={(m) => {
                    m.addDescriptions([
                        'Adds a ribbon button and command palette entry for toggling picker mode.',
                        'When activated, hover over images/SVG elements to see availability status, ' +
                            'then click to initialize or toggle interactivity.',
                    ]);
                    return m;
                }}
                addToggles={[
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
                name={'Auto-detect images'}
                addMultiDesc={(m) => {
                    m.addDescriptions([
                        '* This option is available only for Obsidian Markdown View',
                        'When enabled, the plugin will automatically scan and prepare all suitable ' +
                            'images for potential interactivity.',
                    ]);
                    return m;
                }}
                addToggles={[
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
                    name={'Activation mode for Obsidian Markdown View'}
                    desc={'Live Preview mode uses lazy loading by default'}
                    addButtons={[
                        (button) => {
                            button.setIcon('message-circle-question');
                            button.setTooltip(activationModeTooltip);
                            return button;
                        },
                    ]}
                    addDropdowns={[
                        (dropdown) => {
                            dropdown.addOptions({
                                immediate: 'Immediate',
                                lazy: 'Lazy',
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
