import { t } from '@/lang';

import React, { useCallback, useMemo, useState } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { DropdownComponent } from 'obsidian';

import { PanelsTriggering } from '../../../../types/interfaces';
import { useSettingsContext } from '../../../core/SettingsContext';

const Settings: React.FC = () => {
    const { plugin } = useSettingsContext();

    const [serviceOptionVisible, setServiceOptionVisible] = useState(
        plugin.settings.data.panels.global.triggering.mode !==
            PanelsTriggering.ALWAYS
    );

    const [dropdownQuestionTooltip, setDropdownQuestionTooltip] =
        useState<string>('');

    const panelTriggeringOptionsTooltips: Record<PanelsTriggering, string> =
        useMemo(
            () => ({
                always: t.settings.pages.panels.settings.panelsVisibility
                    .tooltips.always,
                hover: t.settings.pages.panels.settings.panelsVisibility
                    .tooltips.hover,
                focus: t.settings.pages.panels.settings.panelsVisibility
                    .tooltips.focus,
            }),
            [plugin]
        );

    const extractTooltipDependsOnOption = useCallback(
        (dropdown: DropdownComponent) => {
            const selectedValue = dropdown.selectEl.options[
                dropdown.selectEl.options.selectedIndex
            ].value as PanelsTriggering;

            const tooltip = panelTriggeringOptionsTooltips[selectedValue];

            setDropdownQuestionTooltip(tooltip);
        },
        [plugin]
    );

    return (
        <>
            <ReactObsidianSetting
                name={t.settings.pages.panels.settings.header}
                setHeading={true}
            />

            <ReactObsidianSetting
                name={t.settings.pages.panels.settings.panelsVisibility.name}
                desc={t.settings.pages.panels.settings.panelsVisibility.desc}
                dropdowns={[
                    (dropdown) => {
                        dropdown.addOptions({
                            always: t.settings.pages.panels.settings
                                .panelsVisibility.dropdown.always,
                            hover: t.settings.pages.panels.settings
                                .panelsVisibility.dropdown.hover,
                            focus: t.settings.pages.panels.settings
                                .panelsVisibility.dropdown.focus,
                        });
                        dropdown.setValue(
                            plugin.settings.data.panels.global.triggering.mode
                        );
                        extractTooltipDependsOnOption(dropdown);

                        dropdown.onChange(async (value) => {
                            plugin.settings.data.panels.global.triggering.mode =
                                value as PanelsTriggering;
                            setServiceOptionVisible(
                                value !== PanelsTriggering.ALWAYS
                            );
                            extractTooltipDependsOnOption(dropdown);
                            await plugin.settings.saveSettings();
                        });
                        return dropdown;
                    },
                ]}
                buttons={[
                    (button) => {
                        button.setIcon('message-circle-question');
                        button.setTooltip(dropdownQuestionTooltip);
                        return button;
                    },
                ]}
            />

            {serviceOptionVisible && (
                <ReactObsidianSetting
                    name={t.settings.pages.panels.settings.serviceIgnoring.name}
                    desc={t.settings.pages.panels.settings.serviceIgnoring.desc}
                    toggles={[
                        (toggle) => {
                            toggle.setValue(
                                plugin.settings.data.panels.global.triggering
                                    .ignoreService
                            );
                            toggle.onChange(async (value) => {
                                plugin.settings.data.panels.global.triggering.ignoreService =
                                    value;
                                await plugin.settings.saveSettings();
                            });
                            return toggle;
                        },
                    ]}
                />
            )}
        </>
    );
};

export default Settings;
