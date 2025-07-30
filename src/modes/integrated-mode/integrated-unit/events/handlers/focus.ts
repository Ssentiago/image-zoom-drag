import { Component } from 'obsidian';

import { TriggerType } from '../../types/constants';
import Events from '../events';
import { Handler } from '../types/interfaces';

export class Focus extends Component implements Handler {
    constructor(private readonly events: Events) {
        super();
    }

    initialize(): void {
        this.load();

        const { container } = this.events.unit.context;

        this.registerDomEvent(container, 'focusin', this.focusIn);

        this.registerDomEvent(container, 'focusout', this.focusOut);
    }

    private readonly focusIn = (): void => {
        if (
            this.events.unit.plugin.settings.$.units.folding
                .autoFoldOnFocusChange
        ) {
            this.events.unit.controlPanel.fold.unfold();
        }
        this.events.unit.controlPanel.show(TriggerType.FOCUS);
    };

    private readonly focusOut = (): void => {
        if (
            this.events.unit.plugin.settings.$.units.folding
                .autoFoldOnFocusChange
        ) {
            this.events.unit.controlPanel.fold.fold();
        }
        this.events.unit.controlPanel.hide(TriggerType.FOCUS);
    };
}
