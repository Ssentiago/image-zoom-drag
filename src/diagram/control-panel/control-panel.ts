import { Component } from 'obsidian';

import InteractiveElement from '../interactiveElement';
import { TriggerType } from '../types/constants';
import { FoldPanel } from './panels/fold';
import { MovePanel } from './panels/move';
import { ServicePanel } from './panels/service';
import { ZoomPanel } from './panels/zoom';
import { IControlPanel } from './types/interfaces';

export class ControlPanel extends Component implements IControlPanel {
    fold!: FoldPanel;
    move!: MovePanel;
    zoom!: ZoomPanel;
    service!: ServicePanel;
    controlPanel!: HTMLElement;

    constructor(public diagram: InteractiveElement) {
        super();
    }

    initialize(): void {
        this.load();
        this.controlPanel = this.diagram.context.container.createDiv();
        this.controlPanel.addClass('diagram-zoom-drag-control-panel');

        this.move = new MovePanel(this);
        this.zoom = new ZoomPanel(this);
        this.fold = new FoldPanel(this);
        this.service = new ServicePanel(this);

        [this.move, this.zoom, this.fold, this.service].forEach((panel) => {
            this.addChild(panel);
            panel.initialize();
        });

        this.diagram.context.container.appendChild(this.controlPanel);
    }

    private get panels() {
        return [this.move, this.zoom, this.fold, this.service];
    }

    show(triggerType: TriggerType = TriggerType.FORCE): void {
        this.panels.forEach((panel) => panel.show(triggerType));
    }

    hide(triggerType: TriggerType = TriggerType.FORCE) {
        this.panels.forEach((panel) => panel.hide(triggerType));
    }

    get hasVisiblePanels(): boolean {
        return this.panels.some((panel) => panel.isVisible());
    }

    onunload() {
        super.onunload();
        this.controlPanel?.remove();
    }
}
