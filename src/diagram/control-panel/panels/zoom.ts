import { PanelsTriggering } from '../../../settings/types/interfaces';
import { IControlPanel } from '../types/interfaces';
import { BasePanel } from './base-panel';
import { ZoomButtons } from './types/constants';
import { ButtonsData } from './types/interfaces';

export class ZoomPanel extends BasePanel<ZoomButtons> {
    buttons = new Map<ZoomButtons, ButtonsData>();

    constructor(controlPanel: IControlPanel) {
        super(controlPanel);
    }

    get enabled(): boolean {
        return (
            this.controlPanel.diagram.plugin.settings.data.panels.local.panels
                .zoom.on &&
            this.controlPanel.diagram.context.diagramData.panels.zoom.on
        );
    }

    get cssClass() {
        return 'diagram-zoom-panel';
    }

    get cssStyles() {
        return {
            ...this.controlPanel.diagram.plugin.settings.data.panels.local
                .panels.zoom.position,
            transform: 'translateY(-50%)',
            gridTemplateColumns: '1fr',
        };
    }

    getButtonsConfig() {
        const zoomButtons =
            this.controlPanel.diagram.plugin.settings.data.panels.local.panels
                .zoom.buttons;

        const buttons = [];

        if (zoomButtons.in) {
            buttons.push({
                id: ZoomButtons.In,
                icon: 'zoom-in',
                action: (): void =>
                    this.controlPanel.diagram.actions.zoomElement(1.1, {
                        animated: true,
                    }),
                title: 'Zoom In',
            });
        }
        if (zoomButtons.reset) {
            buttons.push({
                id: ZoomButtons.Reset,
                icon: 'refresh-cw',
                action: (): void =>
                    this.controlPanel.diagram.actions.resetZoomAndMove({
                        animated: true,
                    }),
                title: 'Reset Zoom and Position',
            });
        }
        if (zoomButtons.out) {
            buttons.push({
                id: ZoomButtons.Out,
                icon: 'zoom-out',
                action: (): void =>
                    this.controlPanel.diagram.actions.zoomElement(0.9, {
                        animated: true,
                    }),
                title: 'Zoom Out',
            });
        }

        return buttons;
    }

    setupPanelContents() {
        this.panel.toggleClass(
            'hidden',
            this.controlPanel.diagram.plugin.settings.data.panels.global
                .triggering.mode !== PanelsTriggering.ALWAYS
        );

        super.setupPanelContents();
    }
}
