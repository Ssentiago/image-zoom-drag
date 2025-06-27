import { t } from '@/lang';

import React from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from '@obsidian-devkit/native-react-components';

import { useSettingsContext } from '../../../../core/SettingsContext';

interface ButtonManagementModalProps {
    onClose: () => void;
    title: string;
}

const UI_PRIORITY = {
    TOGGLE: 1,
    BUTTON: 2,
} as const;

const ButtonManagementModal: React.FC<ButtonManagementModalProps> = ({
    onClose,
    title,
}) => {
    const { plugin } = useSettingsContext();

    const buttonData = React.useMemo(() => {
        const { zoom, move, service } =
            plugin.settings.data.panels.local.panels;

        const tL = t.image.controlPanel;

        return {
            zoom: [
                {
                    tooltip: tL.zoom.in,
                    icon: 'zoom-in',
                    getValue: () => zoom.buttons.in,
                    setValue: (v: boolean) => (zoom.buttons.in = v),
                },
                {
                    tooltip: tL.zoom.out,
                    icon: 'zoom-out',
                    getValue: () => zoom.buttons.out,
                    setValue: (v: boolean) => (zoom.buttons.out = v),
                },
                {
                    tooltip: tL.zoom.reset,
                    icon: 'refresh-cw',
                    getValue: () => zoom.buttons.reset,
                    setValue: (v: boolean) => (zoom.buttons.reset = v),
                },
            ],
            move: [
                {
                    tooltip: tL.move.up,
                    icon: 'arrow-up',
                    getValue: () => move.buttons.up,
                    setValue: (v: boolean) => (move.buttons.up = v),
                },
                {
                    tooltip: tL.move.down,
                    icon: 'arrow-down',
                    getValue: () => move.buttons.down,
                    setValue: (v: boolean) => (move.buttons.down = v),
                },
                {
                    tooltip: tL.move.left,
                    icon: 'arrow-left',
                    getValue: () => move.buttons.left,
                    setValue: (v: boolean) => (move.buttons.left = v),
                },
                {
                    tooltip: tL.move.right,
                    icon: 'arrow-right',
                    getValue: () => move.buttons.right,
                    setValue: (v: boolean) => (move.buttons.right = v),
                },
                {
                    tooltip: tL.move.upRight,
                    icon: 'arrow-up-right',
                    getValue: () => move.buttons.upRight,
                    setValue: (v: boolean) => (move.buttons.upRight = v),
                },
                {
                    tooltip: tL.move.downRight,
                    icon: 'arrow-down-right',
                    getValue: () => move.buttons.downRight,
                    setValue: (v: boolean) => (move.buttons.downRight = v),
                },
                {
                    tooltip: tL.move.upLeft,
                    icon: 'arrow-up-left',
                    getValue: () => move.buttons.upLeft,
                    setValue: (v: boolean) => (move.buttons.upLeft = v),
                },
                {
                    tooltip: tL.move.downLeft,
                    icon: 'arrow-down-left',
                    getValue: () => move.buttons.downLeft,
                    setValue: (v: boolean) => (move.buttons.downLeft = v),
                },
            ],
            service: [
                {
                    tooltip: tL.service.hide.name,
                    icon: 'eye',
                    getValue: () => service.buttons.hide,
                    setValue: (v: boolean) => (service.buttons.hide = v),
                },
                {
                    tooltip: tL.service.fullscreen.name,
                    icon: 'fullscreen',
                    getValue: () => service.buttons.fullscreen,
                    setValue: (v: boolean) => (service.buttons.fullscreen = v),
                },
            ],
        };
    }, [plugin]);

    return (
        <ReactObsidianModal
            title={title}
            onClose={onClose}
        >
            {Object.entries(buttonData).map(([panel, panelData]) => (
                <React.Fragment key={panel}>
                    <ReactObsidianSetting
                        name={
                            t.image.controlPanel[
                                panel as keyof typeof t.image.controlPanel
                            ].name
                        }
                        setHeading
                    />
                    {panelData.map(
                        ({ tooltip, icon, getValue, setValue }, index) => (
                            <ReactObsidianSetting
                                key={tooltip}
                                name={tooltip}
                                noBorder={index !== panelData.length - 1}
                                buttons={[
                                    {
                                        priority: UI_PRIORITY.BUTTON,
                                        callback: (button) => {
                                            button.setIcon(icon);
                                            button.setTooltip(tooltip);
                                            return button;
                                        },
                                    },
                                ]}
                                toggles={[
                                    {
                                        priority: UI_PRIORITY.TOGGLE,
                                        callback: (toggle) => {
                                            toggle
                                                .setValue(getValue())
                                                .onChange(
                                                    async (value: boolean) => {
                                                        setValue(value);
                                                        await plugin.settings.saveSettings();
                                                    }
                                                );
                                            return toggle;
                                        },
                                    },
                                ]}
                            />
                        )
                    )}
                </React.Fragment>
            ))}
        </ReactObsidianModal>
    );
};

export default ButtonManagementModal;
