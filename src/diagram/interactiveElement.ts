import { Component } from 'obsidian';

import DiagramZoomDragPlugin from '../core/diagram-zoom-drag-plugin';
import { DiagramActions } from './actions/diagram-actions';
import { ControlPanel } from './control-panel/control-panel';
import Events from './events/events';
import { updateDiagramSize } from './helpers';
import InteractiveStateManager from './interactive-state-manager';
import { DiagramContext, FileStats } from './types/interfaces';

export default class InteractiveElement extends Component {
    id!: string;
    dx = 0;
    dy = 0;
    scale = 1;
    nativeTouchEventsEnabled = false;
    context!: DiagramContext;
    fileStats!: FileStats;
    active = false;

    actions!: DiagramActions;
    controlPanel!: ControlPanel;
    events!: Events;
    interactiveStateManager!: InteractiveStateManager;
    plugin!: DiagramZoomDragPlugin;

    constructor(
        plugin: DiagramZoomDragPlugin,
        context: DiagramContext,
        fileStats: FileStats
    ) {
        super();

        this.id = crypto.randomUUID();

        this.plugin = plugin;
        this.context = context;
        this.fileStats = fileStats;
        this.interactiveStateManager = new InteractiveStateManager(this);

        this.actions = new DiagramActions(this);
        this.controlPanel = new ControlPanel(this);
        this.events = new Events(this);

        this.addChild(this.events);
        this.addChild(this.controlPanel);

        this.interactiveStateManager.initialize();
    }

    initialize(): void {
        this.plugin.logger.debug(`Initialize diagram with id ${this.id}`);

        this.load();

        this.events.initialize();
        this.controlPanel.initialize();

        this.applyLayout();

        this.plugin.logger.debug('Diagram initialized successfully', {
            id: this.id,
        });
    }

    applyLayout() {
        updateDiagramSize(
            this.context,
            this.context.size,
            this.plugin.settings.data.diagrams.size,
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
