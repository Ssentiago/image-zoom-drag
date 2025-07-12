import { t } from '@/lang';

import React, { useCallback, useMemo, useState } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { DropdownComponent } from 'obsidian';

import { PanelsTriggering } from '../../../../types/interfaces';
import { useSettingsContext } from '../../../core/SettingsContext';

const Controls: React.FC = () => {
    const { plugin } = useSettingsContext();

    const [serviceOptionVisible, setServiceOptionVisible] = useState(
        plugin.settings.$.panels.global.triggering.mode !==
            PanelsTriggering.ALWAYS
    );

    const [dropdownQuestionTooltip, setDropdownQuestionTooltip] =
        useState<string>('');

    const panelTriggeringOptionsTooltips: Record<PanelsTriggering, string> =
        useMemo(
            () => ({
                always: t.settings.pages.images.controls.visibility.tooltips
                    .always,
                hover: t.settings.pages.images.controls.visibility.tooltips
                    .hover,
                focus: t.settings.pages.images.controls.visibility.tooltips
                    .focus,
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
                name={t.settings.pages.images.controls.visibility.name}
                desc={t.settings.pages.images.controls.visibility.desc}
                dropdowns={[
                    (dropdown) => {
                        dropdown.addOptions({
                            always: t.settings.pages.images.controls.visibility
                                .dropdown.always,
                            hover: t.settings.pages.images.controls.visibility
                                .dropdown.hover,
                            focus: t.settings.pages.images.controls.visibility
                                .dropdown.focus,
                        });
                        dropdown.setValue(
                            plugin.settings.$.panels.global.triggering.mode
                        );
                        extractTooltipDependsOnOption(dropdown);

                        dropdown.onChange(async (value) => {
                            plugin.settings.$.panels.global.triggering.mode =
                                value as PanelsTriggering;
                            setServiceOptionVisible(
                                value !== PanelsTriggering.ALWAYS
                            );
                            extractTooltipDependsOnOption(dropdown);
                            await plugin.settings.save();
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
                    name={t.settings.pages.images.controls.serviceIgnoring.name}
                    desc={t.settings.pages.images.controls.serviceIgnoring.desc}
                    toggles={[
                        (toggle) => {
                            toggle.setValue(
                                plugin.settings.$.panels.global.triggering
                                    .ignoreService
                            );
                            toggle.onChange(async (value) => {
                                plugin.settings.$.panels.global.triggering.ignoreService =
                                    value;
                                await plugin.settings.save();
                            });
                            return toggle;
                        },
                    ]}
                />
            )}
        </>
    );
};

export default Controls;
