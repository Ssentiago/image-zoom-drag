import { Component } from 'obsidian';

import InteractifyPlugin from '../core/interactify-plugin';
import { UnitActions } from './actions/unit-actions';
import { ControlPanel } from './control-panel/control-panel';
import Events from './events/events';
import { updateUnitSize } from './helpers';
import InteractifyUnitStateManager from './interactify-unit-state-manager';
import { UnitContext, FileStats } from './types/interfaces';

export default class InteractifyUnit extends Component {
    id!: string;
    dx = 0;
    dy = 0;
    scale = 1;
    nativeTouchEventsEnabled = false;
    context!: UnitContext;
    fileStats!: FileStats;
    active = false;

    actions!: UnitActions;
    controlPanel!: ControlPanel;
    events!: Events;
    interactiveStateManager!: InteractifyUnitStateManager;
    plugin!: InteractifyPlugin;

    constructor(
        plugin: InteractifyPlugin,
        context: UnitContext,
        fileStats: FileStats
    ) {
        super();

        this.id = crypto.randomUUID();

        this.plugin = plugin;
        this.context = context;
        this.fileStats = fileStats;
        this.interactiveStateManager = new InteractifyUnitStateManager(this);

        this.actions = new UnitActions(this);
        this.controlPanel = new ControlPanel(this);
        this.events = new Events(this);

        this.addChild(this.events);
        this.addChild(this.controlPanel);

        this.interactiveStateManager.initialize();
    }

    initialize(): void {
        this.plugin.logger.debug(`Initialize unit with id ${this.id}`);

        this.load();

        this.events.initialize();
        this.controlPanel.initialize();

        this.applyLayout();

        this.plugin.logger.debug('Unit initialized successfully', {
            id: this.id,
        });
    }

    applyLayout() {
        updateUnitSize(
            this.context,
            this.context.size,
            this.plugin.settings.data.units.size,
            this.plugin.context.inLivePreviewMode
        );

        this.actions.fitToContainer({ animated: true });
    }

    async onDelete() {
        await this.interactiveStateManager.deactivate();

        this.interactiveStateManager.unload();
    }

    onunload() {
        super.onunload();
        this.plugin.logger.debug(
            `Called unload for interactive element with id ${this.id}`
        );
    }
}
