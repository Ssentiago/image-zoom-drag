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

        return {
            zoom: [
                {
                    tooltip: t.image.controlPanel.zoom.in,
                    icon: 'zoom-in',
                    getValue: () => zoom.buttons.in,
                    setValue: (v: boolean) => (zoom.buttons.in = v),
                },
                {
                    tooltip: t.image.controlPanel.zoom.out,
                    icon: 'zoom-out',
                    getValue: () => zoom.buttons.out,
                    setValue: (v: boolean) => (zoom.buttons.out = v),
                },
                {
                    tooltip: t.image.controlPanel.zoom.reset,
                    icon: 'refresh-cw',
                    getValue: () => zoom.buttons.reset,
                    setValue: (v: boolean) => (zoom.buttons.reset = v),
                },
            ],
            move: [
                {
                    tooltip: t.image.controlPanel.move.up,
                    icon: 'arrow-up',
                    getValue: () => move.buttons.up,
                    setValue: (v: boolean) => (move.buttons.up = v),
                },
                {
                    tooltip: t.image.controlPanel.move.down,
                    icon: 'arrow-down',
                    getValue: () => move.buttons.down,
                    setValue: (v: boolean) => (move.buttons.down = v),
                },
                {
                    tooltip: t.image.controlPanel.move.left,
                    icon: 'arrow-left',
                    getValue: () => move.buttons.left,
                    setValue: (v: boolean) => (move.buttons.left = v),
                },
                {
                    tooltip: t.image.controlPanel.move.right,
                    icon: 'arrow-right',
                    getValue: () => move.buttons.right,
                    setValue: (v: boolean) => (move.buttons.right = v),
                },
                {
                    tooltip: t.image.controlPanel.move.upRight,
                    icon: 'arrow-up-right',
                    getValue: () => move.buttons.upRight,
                    setValue: (v: boolean) => (move.buttons.upRight = v),
                },
                {
                    tooltip: t.image.controlPanel.move.downRight,
                    icon: 'arrow-down-right',
                    getValue: () => move.buttons.downRight,
                    setValue: (v: boolean) => (move.buttons.downRight = v),
                },
                {
                    tooltip: t.image.controlPanel.move.upLeft,
                    icon: 'arrow-up-left',
                    getValue: () => move.buttons.upLeft,
                    setValue: (v: boolean) => (move.buttons.upLeft = v),
                },
                {
                    tooltip: t.image.controlPanel.move.downLeft,
                    icon: 'arrow-down-left',
                    getValue: () => move.buttons.downLeft,
                    setValue: (v: boolean) => (move.buttons.downLeft = v),
                },
            ],
            service: [
                {
                    tooltip: t.image.controlPanel.service.hide.name,
                    icon: 'eye',
                    getValue: () => service.buttons.hide,
                    setValue: (v: boolean) => (service.buttons.hide = v),
                },
                {
                    tooltip: t.image.controlPanel.service.fullscreen.name,
                    icon: 'fullscreen',
                    getValue: () => service.buttons.fullscreen,
                    setValue: (v: boolean) => (service.buttons.fullscreen = v),
                },
            ],
        };
    }, [plugin]);

    const panelNames = {
        zoom: t.image.controlPanel.zoom.name,
        move: t.image.controlPanel.move.name,
        service: t.image.controlPanel.service.name,
    };

    return (
        <ReactObsidianModal
            title={title}
            onClose={onClose}
        >
            {Object.entries(buttonData).map(([panel, panelData]) => (
                <React.Fragment key={panel}>
                    <ReactObsidianSetting
                        name={panelNames[panel as keyof typeof panelNames]}
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
