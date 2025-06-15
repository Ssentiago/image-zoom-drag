import { Platform } from 'obsidian';

import { PanelsTriggering } from '../../../settings/types/interfaces';
import { TriggerType } from '../../types/constants';
import { updateButton } from '../helpers/helpers';
import { IControlPanel } from '../types/interfaces';
import { BasePanel } from './base-panel';
import { ServiceButtons } from './types/constants';
import { ButtonsData } from './types/interfaces';

export class ServicePanel extends BasePanel<ServiceButtons> {
    buttons = new Map<ServiceButtons, ButtonsData>();

    constructor(controlPanel: IControlPanel) {
        super(controlPanel);
    }

    initialize(): void {
        super.initialize();
        this.setupEventListeners();
    }

    get enabled(): boolean {
        return (
            this.diagram.plugin.settings.data.panels.local.panels.service.on &&
            this.diagram.context.diagramData.panels.service.on
        );
    }

    get cssClass() {
        return 'diagram-service-panel';
    }

    get cssStyles() {
        return {
            ...this.diagram.plugin.settings.data.panels.local.panels.service
                .position,
            gridTemplateColumns: 'repeat(auto-fit, minmax(24px, 1fr))',
            gridAutoFlow: 'column',
        };
    }

    getButtonsConfig() {
        const buttons = [];
        const container = this.diagram.container;
        const serviceButtons =
            this.diagram.plugin.settings.data.panels.local.panels.service
                .buttons;

        if (serviceButtons.hide) {
            buttons.push({
                id: ServiceButtons.Hide,
                icon: 'eye',
                action: (): void => {
                    const button = this.buttons.get(
                        ServiceButtons.Hide
                    )?.element;

                    if (!button) {
                        return;
                    }
                    const isCurrentlyHiding = button.dataset.hiding === 'true';

                    const willBeHiding = !isCurrentlyHiding;

                    button.dataset.hiding = willBeHiding.toString();

                    isCurrentlyHiding
                        ? this.controlPanel.show(TriggerType.SERVICE_HIDING)
                        : this.controlPanel.hide(TriggerType.SERVICE_HIDING);

                    updateButton(
                        button,
                        isCurrentlyHiding ? 'eye' : 'eye-off',
                        `Panels are ${willBeHiding ? 'hidden' : 'visible'} (click to toggle)`
                    );
                },
                title: `Panels are visible (click to toggle)`,
                dataAttributes: {
                    hiding: 'false',
                },
            });
        }

        if (serviceButtons.fullscreen) {
            buttons.push({
                id: ServiceButtons.Fullscreen,
                icon: 'maximize',
                action: async (): Promise<void> => {
                    const button = this.buttons.get(
                        ServiceButtons.Fullscreen
                    )?.element;

                    if (!button) {
                        return;
                    }

                    if (!document.fullscreenElement) {
                        container.addClass('is-fullscreen');
                        await container.requestFullscreen({
                            navigationUI: 'auto',
                        });
                        updateButton(
                            button,
                            'minimize',
                            'Open in fullscreen mode'
                        );
                    } else {
                        container.removeClass('is-fullscreen');
                        await document.exitFullscreen();
                        updateButton(
                            button,
                            'maximize',
                            'Exit fullscreen mode'
                        );
                    }
                },
                title: 'Open in fullscreen mode',
            });
        }

        if (Platform.isMobileApp) {
            buttons.push({
                id: ServiceButtons.Touch,
                icon: this.diagram.nativeTouchEventsEnabled
                    ? 'circle-slash-2'
                    : 'hand',
                action: (): void => {
                    const btn = this.buttons.get(ServiceButtons.Touch)?.element;

                    if (!btn) {
                        return;
                    }

                    this.diagram.nativeTouchEventsEnabled =
                        !this.diagram.nativeTouchEventsEnabled;

                    const actualNativeTouchEventsEnabled =
                        this.diagram.nativeTouchEventsEnabled;

                    updateButton(
                        btn,
                        this.diagram.nativeTouchEventsEnabled
                            ? 'circle-slash-2'
                            : 'hand',
                        `${actualNativeTouchEventsEnabled ? 'Enable' : 'Disable'} move and pinch zoom`
                    );

                    this.diagram.plugin.showNotice(
                        `Native touches are ${actualNativeTouchEventsEnabled ? 'enabled' : 'disabled'} now. 
            You ${actualNativeTouchEventsEnabled ? 'cannot' : 'can'} move and pinch zoom diagram diagram.`
                    );
                },
                title: `${this.diagram.nativeTouchEventsEnabled ? 'Enable' : 'Disable'} move and pinch zoom`,
            });
        }

        return buttons;
    }

    setupPanelContents() {
        const settings = this.diagram.plugin.settings;
        this.panel.toggleClass(
            'hidden',
            settings.data.panels.global.triggering.mode !==
                PanelsTriggering.ALWAYS &&
                !settings.data.panels.global.triggering.ignoreService
        );
        super.setupPanelContents();
    }

    setupEventListeners(): void {
        const fullscreenButton = this.buttons.get(
            ServiceButtons.Fullscreen
        )?.element;

        if (!fullscreenButton) {
            return;
        }

        this.registerDomEvent(
            this.diagram.container,
            'fullscreenchange',
            this.onFullScreenChange
        );
    }

    private readonly onFullScreenChange = (): void => {
        const button = this.buttons.get(ServiceButtons.Fullscreen)?.element;

        if (!button) {
            return;
        }
        if (document.fullscreenElement) {
            requestAnimationFrame(() => {
                this.diagram.actions.resetZoomAndMove();
            });
            updateButton(button, 'minimize', 'Exit fullscreen mode');
        } else {
            requestAnimationFrame(() => {
                this.diagram.actions.resetZoomAndMove();
            });
            updateButton(button, 'maximize', 'Open in fullscreen mode');
        }
    };

    protected get supportedTriggers(): number {
        const base = super.supportedTriggers & ~TriggerType.SERVICE_HIDING;
        const shouldIgnoreExternalTriggers =
            this.diagram.plugin.settings.data.panels.global.triggering
                .ignoreService;

        if (!shouldIgnoreExternalTriggers) {
            return base;
        }

        const unSupportedFlags = TriggerType.MOUSE | TriggerType.FOCUS;
        return base & ~unSupportedFlags;
    }
}
