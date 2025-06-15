import { Component } from 'obsidian';

import { TriggerType } from '../../types/constants';
import Events from '../events';
import { Handler } from '../types/interfaces';

export class FocusHandler extends Component implements Handler {
    constructor(private readonly events: Events) {
        super();
    }

    initialize(): void {
        if (!this.events.diagram.plugin.context.view) {
            return;
        }

        const container = this.events.diagram.container;

        this.events.diagram.plugin.context.view.registerDomEvent(
            container,
            'focusin',
            this.focusIn
        );

        this.events.diagram.plugin.context.view.registerDomEvent(
            container,
            'focusout',
            this.focusOut
        );
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
