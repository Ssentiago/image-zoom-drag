import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from '../../../../../../lang';
import { Panels, PanelsConfig } from '../../../../../types/interfaces';
import { useSettingsContext } from '../../../../core/SettingsContext';
import {
    UnitPreview,
    UnitSetup,
    FoldPanel,
    PanelControl,
    PanelPreview,
    PanelToggle,
} from './PanelLayout.styled';
import useDragDrop from './hooks/useDragDrop';

const PanelLayout: FC = () => {
    const { plugin } = useSettingsContext();
    const [panels, setPanels] = useState(
        plugin.settings.data.panels.local.panels
    );
    const tL = useMemo(() => t.image.controlPanel, []);

    const [, setUpdateTrigger] = useState(false);
    const unitPreviewRef = React.useRef<HTMLDivElement>(null);

    const { draggedPanel, props } = useDragDrop({
        unitPreviewRef: unitPreviewRef,
        panels,
    });

    useEffect(() => {
        const handler = (p: any) => {
            setUpdateTrigger((prev) => !prev);
        };

        plugin.settings.eventBus.on(
            plugin.settings.events.panels.local.panels.$all,
            handler
        );

        return () => {
            plugin.settings.eventBus.off(
                plugin.settings.events.panels.local.panels.$all,
                handler
            );
        };
    }, []);

    const togglePanelState = async (
        panelName: keyof Panels['local']['panels']
    ): Promise<void> => {
        panels[panelName].on = !panels[panelName].on;
        await plugin.settings.saveSettings();
    };

    return (
        <UnitSetup>
            <UnitPreview
                ref={unitPreviewRef}
                onDragOver={(e) => e.preventDefault()}
                {...props.container}
            >
                {Object.entries(panels).map(
                    ([name, config]) =>
                        config.on && (
                            <PanelPreview
                                key={name}
                                dragging={draggedPanel === name}
                                {...props.panel(name)}
                                style={{
                                    ...config.position,
                                }}
                            >
                                {tL[name as keyof typeof tL].name}
                            </PanelPreview>
                        )
                )}
                <FoldPanel>{tL['fold' as keyof typeof tL].name}</FoldPanel>
            </UnitPreview>
            <PanelControl>
                {Object.entries(panels).map(([name, config]) => (
                    <PanelToggle key={name}>
                        <input
                            type='checkbox'
                            checked={config.on}
                            onChange={() =>
                                togglePanelState(name as keyof PanelsConfig)
                            }
                        />
                        {tL[name as keyof typeof tL].name}
                    </PanelToggle>
                ))}
            </PanelControl>
        </UnitSetup>
    );
};

export default PanelLayout;
