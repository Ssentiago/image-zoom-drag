import { Component } from 'obsidian';

import { TriggerType } from '../../types/constants';
import Events from '../events';
import { Handler } from '../types/interfaces';

export class FocusHandler extends Component implements Handler {
    constructor(private readonly events: Events) {
        super();
    }

    initialize(): void {
        this.load();

        const { container } = this.events.diagram.context;

        this.registerDomEvent(container, 'focusin', this.focusIn);

        this.registerDomEvent(container, 'focusout', this.focusOut);
    }

    private readonly focusIn = (): void => {
        if (
            this.events.diagram.plugin.settings.data.diagrams.folding
                .autoFoldOnFocusChange
        ) {
            this.events.diagram.controlPanel.fold.unfold();
        }
        this.events.diagram.controlPanel.show(TriggerType.FOCUS);
    };

    private readonly focusOut = (): void => {
        if (
            this.events.diagram.plugin.settings.data.diagrams.folding
                .autoFoldOnFocusChange
        ) {
            this.events.diagram.controlPanel.fold.fold();
        }
        this.events.diagram.controlPanel.hide(TriggerType.FOCUS);
    };
}
