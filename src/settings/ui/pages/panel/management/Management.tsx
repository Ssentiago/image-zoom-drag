import React, { useEffect, useRef } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';

import { t } from '../../../../../lang';
import { useSettingsContext } from '../../../core/SettingsContext';
import ButtonManagementModal from './modals/ButtonManagementModal';
import LayoutModal from './modals/LayoutModal';

const Management: React.FC = () => {
    const { plugin } = useSettingsContext();
    const [layoutModalOpen, setLayoutModalOpen] = React.useState(false);
    const [buttonModalOpen, setButtonModalOpen] = React.useState(false);

    const isApplyingPreset = useRef(false);

    const presets = {
        minimal: {
            zoom: { in: true, out: true, reset: false },
            move: {
                up: false,
                down: false,
                left: false,
                right: false,
                upRight: false,
                downRight: false,
                upLeft: false,
                downLeft: false,
            },
            service: { hide: true, fullscreen: false },
        },
        full: {
            zoom: { in: true, out: true, reset: true },
            move: {
                up: true,
                down: true,
                left: true,
                right: true,
                upRight: true,
                downRight: true,
                upLeft: true,
                downLeft: true,
            },
            service: { hide: true, fullscreen: true },
        },
        presentation: {
            zoom: { in: true, out: true, reset: true },
            move: {
                up: false,
                down: false,
                left: false,
                right: false,
                upRight: false,
                downRight: false,
                upLeft: false,
                downLeft: false,
            },
            service: { hide: true, fullscreen: true },
        },
    };

    useEffect(() => {
        const handler = async (payload: any) => {
            if (isApplyingPreset.current) {
                return;
            }

            plugin.settings.data.panels.local.preset = 'none';

            await plugin.settings.saveSettings();
        };

        plugin.settings.eventBus.on(
            `${plugin.settings.events.panels.local.panels.$all}`,
            handler
        );

        return () => {
            plugin.settings.eventBus.off(
                `${plugin.settings.events.panels.local.panels.$all}`,
                handler
            );
        };
    }, [plugin, isApplyingPreset]);

    const applyPreset = async (preset: keyof typeof presets) => {
        isApplyingPreset.current = true;

        const { zoom, move, service } =
            plugin.settings.data.panels.local.panels;
        const config = presets[preset];

        Object.assign(zoom.buttons, config.zoom);
        Object.assign(move.buttons, config.move);
        Object.assign(service.buttons, config.service);

        await plugin.settings.saveSettings();
        isApplyingPreset.current = false;
    };

    return (
        <>
            <ReactObsidianSetting
                name={t.settings.pages.panels.management.preset.name}
                desc={t.settings.pages.panels.management.preset.desc}
                dropdowns={[
                    (dropdown) => {
                        dropdown
                            .addOption(
                                'none',
                                t.settings.pages.panels.management.preset
                                    .dropdown.none
                            )
                            .addOption(
                                'minimal',
                                t.settings.pages.panels.management.preset
                                    .dropdown.minimal
                            )
                            .addOption(
                                'full',
                                t.settings.pages.panels.management.preset
                                    .dropdown.full
                            )
                            .addOption(
                                'presentation',
                                t.settings.pages.panels.management.preset
                                    .dropdown.presentation
                            )
                            .setValue(plugin.settings.data.panels.local.preset)

                            .onChange(async (value) => {
                                if (value) {
                                    plugin.settings.data.panels.local.preset =
                                        value as keyof typeof presets;
                                    await applyPreset(
                                        value as keyof typeof presets
                                    );
                                }
                            });
                        return dropdown;
                    },
                ]}
            />

            <ReactObsidianSetting
                name={t.settings.pages.panels.management.panelLayout.name}
                desc={t.settings.pages.panels.management.panelLayout.desc}
                buttons={[
                    (button) => {
                        button.setIcon('layout');
                        button.setTooltip(t.settings.pages.panels.management.panelLayout.tooltip);
                        button.onClick(() => {
                            setLayoutModalOpen(true);
                        });
                        return button;
                    },
                ]}
            />
            <ReactObsidianSetting
                name={t.settings.pages.panels.management.buttonsLayout.name}
                desc={t.settings.pages.panels.management.buttonsLayout.desc}
                buttons={[
                    (button) => {
                        button.setIcon('panels-top-left');
                        button.setTooltip(t.settings.pages.panels.management.buttonsLayout.tooltip);
                        button.onClick(() => {
                            setButtonModalOpen(true);
                        });
                        return button;
                    },
                ]}
            />
            {layoutModalOpen && (
                <LayoutModal
                    onClose={() => setLayoutModalOpen(false)}
                    title={t.settings.pages.panels.management.panelLayoutModal.title}
                />
            )}
            {buttonModalOpen && (
                <ButtonManagementModal
                    onClose={() => setButtonModalOpen(false)}
                    title={t.settings.pages.panels.management.buttonsLayoutModal.title}
                />
            )}
        </>
    );
};

export default Management;
