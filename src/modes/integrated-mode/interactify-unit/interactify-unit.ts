import { Component } from 'obsidian';

import InteractifyPlugin from '../../../core/interactify-plugin';
import { UnitActions } from './actions/unit-actions';
import { ControlPanel } from './control-panel/control-panel';
import Events from './events/events';
import InteractifyUnitStateManager from './interactify-unit-state-manager';
import { FileStats, UnitContext } from './types/interfaces';

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

    get realSize() {
        const { innerHeight, innerWidth } =
            this.plugin.integratedMode.context.view!.contentEl;

        const settingsSizeData = this.plugin.settings.data.units.size;
        const isFolded = this.context.container.dataset.folded === 'true';
        const setting = isFolded
            ? settingsSizeData.folded
            : settingsSizeData.expanded;

        const heightValue = setting.height.value;
        const widthValue = setting.width.value;

        let heightInPx =
            setting.height.type === '%'
                ? (heightValue / 100) * this.context.size.height
                : heightValue;
        let widthInPx =
            setting.width.type === '%'
                ? (widthValue / 100) * this.context.size.width
                : widthValue;

        if (innerWidth > 0 && innerHeight > 0) {
            heightInPx = Math.min(heightInPx, innerHeight);
            widthInPx = Math.min(widthInPx, innerWidth);
        }

        return {
            width: widthInPx,
            height: heightInPx,
        };
    }

    applyLayout() {
        this.applyRealSize();
        this.actions.fitToContainer({ animated: false });
    }

    applyRealSize() {
        const realSize = this.realSize;

        this.context.container.style.height = `${realSize.height}px`;
        this.context.container.style.width = `${realSize.width}px`;

        if (this.plugin.integratedMode.context.inLivePreviewMode) {
            const parent = this.context.livePreviewWidget!;
            parent.style.setProperty(
                'height',
                `${realSize.height}px`,
                'important'
            );
            parent.style.setProperty(
                'width',
                `${realSize.width}px`,
                'important'
            );
        }
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
