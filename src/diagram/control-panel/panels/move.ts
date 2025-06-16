import { PanelsTriggering } from '../../../settings/types/interfaces';
import { IControlPanel } from '../types/interfaces';
import { BasePanel } from './base-panel';
import { MoveButtons } from './types/constants';
import { ButtonsData } from './types/interfaces';

export class MovePanel extends BasePanel<MoveButtons> {
    buttons = new Map<MoveButtons, ButtonsData>();

    constructor(controlPanel: IControlPanel) {
        super(controlPanel);
    }

    get enabled(): boolean {
        return (
            this.diagram.plugin.settings.data.panels.local.panels.move.on &&
            this.diagram.context.diagramData.panels.move?.on
        );
    }

    get cssClass() {
        return 'diagram-move-panel';
    }

    get cssStyles() {
        return {
            ...this.diagram.plugin.settings.data.panels.local.panels.move
                .position,
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
        };
    }

    getButtonsConfig() {
        const moveButtons =
            this.diagram.plugin.settings.data.panels.local.panels.move.buttons;

        const buttons = [
            {
                id: MoveButtons.UpLeft,
                icon: 'arrow-up-left',
                title: 'Move up left',
                gridArea: '1 / 1',
                x: 50,
                y: 50,
            },
            {
                id: MoveButtons.Up,
                icon: 'arrow-up',
                title: 'Move up',
                gridArea: '1 / 2',
                x: 0,
                y: 50,
            },
            {
                id: MoveButtons.UpRight,
                icon: 'arrow-up-right',
                title: 'Move up right',
                gridArea: '1 / 3',
                x: -50,
                y: 50,
            },
            {
                id: MoveButtons.Left,
                icon: 'arrow-left',
                title: 'Move left',
                gridArea: '2 / 1',
                x: 50,
                y: 0,
            },
            {
                id: MoveButtons.Right,
                icon: 'arrow-right',
                title: 'Move right',
                gridArea: '2 / 3',
                x: -50,
                y: 0,
            },
            {
                id: MoveButtons.DownLeft,
                icon: 'arrow-down-left',
                title: 'Move down left',
                gridArea: '3 / 1',
                x: 50,
                y: -50,
            },
            {
                id: MoveButtons.Down,
                icon: 'arrow-down',
                title: 'Move down',
                gridArea: '3 / 2',
                x: 0,
                y: -50,
            },
            {
                id: MoveButtons.DownRight,
                icon: 'arrow-down-right',
                title: 'Move down right',
                gridArea: '3 / 3',
                x: -50,
                y: -50,
            },
        ];

        return buttons
            .filter((config) => moveButtons[config.id])
            .map((config) => ({
                id: config.id,
                icon: config.icon,
                action: () =>
                    this.diagram.actions.moveElement(config.x, config.y, {
                        animated: true,
                    }),
                title: config.title,
                gridArea: config.gridArea,
            }));
    }

    setupPanelContents() {
        super.setupPanelContents();
        this.panel.toggleClass(
            'hidden',
            this.diagram.plugin.settings.data.panels.global.triggering.mode !==
                PanelsTriggering.ALWAYS
        );
    }
}
