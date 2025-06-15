import { Component } from 'obsidian';

import DiagramZoomDragPlugin from '../core/diagram-zoom-drag-plugin';
import { DiagramActions } from './actions/diagram-actions';
import { ControlPanel } from './control-panel/control-panel';
import Events from './events/events';
import { updateDiagramSize } from './helpers';
import { DiagramContext, FileStats } from './types/interfaces';

export default class Diagram extends Component {
    container: HTMLElement;
    originalParent: HTMLElement;
    id!: string;
    dx = 0;
    dy = 0;
    scale = 1;
    nativeTouchEventsEnabled = false;
    context: DiagramContext;
    fileStats: FileStats;

    actions: DiagramActions;
    controlPanel: ControlPanel;
    events: Events;

    constructor(
        public plugin: DiagramZoomDragPlugin,
        container: HTMLElement,
        context: DiagramContext,
        fileStats: FileStats
    ) {
        super();

        this.container = container;
        this.originalParent = container.parentNode as HTMLElement;

        this.context = context;
        this.fileStats = fileStats;

        this.actions = new DiagramActions(this);
        this.controlPanel = new ControlPanel(this);
        this.events = new Events(this);

        this.addChild(this.events);
        this.addChild(this.controlPanel);

        this.load();

        this.plugin.logger.debug('Diagram created', {
            id: this.id,
            name: this.context.diagramData.name,
        });
    }

    initialize(): void {
        this.plugin.logger.debug(`Initialize diagram with id ${this.id}`);
        this.controlPanel.initialize();
        this.events.initialize();

        updateDiagramSize(
            this.container,
            this.context.size,
            this.plugin.settings.data.diagrams.size,
            this.plugin.context.inLivePreviewMode
        );

        this.actions.fitToContainer(
            this.context.diagramElement,
            this.container
        );

        this.plugin.logger.debug('Diagram initialized successfully', {
            id: this.id,
        });
    }

    restoreOriginalDom(): void {
        this.plugin.logger.debug('Restoring original DOM for diagram', {
            id: this.id,
        });

        const element = this.context.diagramElement;
        element.setCssStyles({
            transform: 'none',
            transition: 'none',
        });

        const originalParent = this.originalParent;

        originalParent.removeClass('live-preview-parent');
        element.removeClass('diagram-content');

        this.container.remove();

        this.originalParent.style.removeProperty('height');
        this.originalParent.style.removeProperty('width');

        originalParent.appendChild(element);
    }

    onunload(): void {
        this.restoreOriginalDom();
        this.plugin.logger.debug('Diagram unloaded', { id: this.id });
        super.onunload();
    }
}
