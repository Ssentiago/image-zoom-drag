import { t } from '@/lang';

import { FC, useCallback, useMemo, useState } from 'react';

import { OSetting } from '@obsidian-devkit/native-react-components';

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

    const [activationModeTooltip, setActivationModeTooltip] = useState<string>(
        activationModeTooltips[activationMode]
    );

    const updateActivationModeTooltip = useCallback(
        (selectElement: HTMLSelectElement) => {
            const selectedValue = selectElement.value as ActivationMode;
            setActivationModeTooltip(activationModeTooltips[selectedValue]);
        },
        []
    );

    return (
        <>
            <OSetting
                name={t.settings.pages.images.general.interactive.header}
                heading
            />

            <OSetting
                name={
                    t.settings.pages.images.general.interactive.pickerMode.name
                }
                desc={
                    t.settings.pages.images.general.interactive.pickerMode.desc
                }
            >
                <input
                    type={'checkbox'}
                    defaultChecked={
                        plugin.settings.$.units.interactivity.picker.enabled
                    }
                    onChange={async (e) => {
                        plugin.settings.$.units.interactivity.picker.enabled =
                            e.target.checked;
                        await plugin.settings.save();
                    }}
                />
            </OSetting>

            <OSetting
                name={
                    t.settings.pages.images.general.interactive.autoDetect.name
                }
                desc={
                    t.settings.pages.images.general.interactive.autoDetect.desc
                }
            >
                <input
                    type={'checkbox'}
                    defaultChecked={
                        plugin.settings.$.units.interactivity.markdown
                            .autoDetect
                    }
                    onChange={async (e) => {
                        const value = e.target.checked;
                        setIsIMOptionEnabled(value);
                        plugin.settings.$.units.interactivity.markdown.autoDetect =
                            value;
                        await plugin.settings.save();
                    }}
                />
            </OSetting>

            {isIMOptionEnabled && (
                <OSetting
                    name={
                        t.settings.pages.images.general.interactive
                            .activationMode.name
                    }
                    desc={
                        t.settings.pages.images.general.interactive
                            .activationMode.desc
                    }
                >
                    <select
                        value={
                            plugin.settings.$.units.interactivity.markdown
                                .activationMode
                        }
                        onChange={async (e) => {
                            const mode = e.target.value as ActivationMode;
                            setActivationMode(mode);
                            plugin.settings.$.units.interactivity.markdown.activationMode =
                                mode;
                            await plugin.settings.save();
                            updateActivationModeTooltip(e.target);
                        }}
                    >
                        <option value='immediate'>
                            {
                                t.settings.pages.images.general.interactive
                                    .activationMode.dropdown.immediate
                            }
                        </option>
                        <option value='lazy'>
                            {
                                t.settings.pages.images.general.interactive
                                    .activationMode.dropdown.lazy
                            }
                        </option>
                    </select>
                    <button
                        aria-label={activationModeTooltip}
                        data-icon={'message-circle-question'}
                    />
                </OSetting>
            )}
        </>
    );
};

export default Interactive;
