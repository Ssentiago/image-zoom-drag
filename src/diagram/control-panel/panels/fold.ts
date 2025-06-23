import { updateDiagramSize } from '../../helpers';
import { TriggerType } from '../../types/constants';
import { updateButton } from '../helpers/helpers';
import { IControlPanel } from '../types/interfaces';
import { BasePanel } from './base-panel';
import { FoldButtons } from './types/constants';
import { ButtonsData } from './types/interfaces';

export class FoldPanel extends BasePanel<FoldButtons> {
    buttons = new Map<FoldButtons, ButtonsData>();

    constructor(public readonly controlPanel: IControlPanel) {
        super(controlPanel);
    }

    get enabled(): boolean {
        return true;
    }

    get cssStyles() {
        return {
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            gridTemplateColumns: '1fr',
        };
    }

    get cssClass() {
        return 'diagram-fold-panel';
    }

    getButtonsConfig() {
        const isFolded =
            this.diagram.context.container.dataset.folded === 'true';

        return [
            {
                icon: isFolded ? 'unfold-vertical' : 'fold-vertical',
                action: (): void => {
                    const isFolded =
                        this.controlPanel.diagram.context.container.dataset
                            .folded === 'true';

                    isFolded ? this.unfold() : this.fold();

                    const button = this.buttons.get(FoldButtons.Fold);

                    if (button) {
                        updateButton(
                            button.element,
                            isFolded ? 'fold-vertical' : 'unfold-vertical',
                            isFolded ? 'Fold diagram' : 'Expand diagram'
                        );
                    }
                },
                title: isFolded ? 'Expand diagram' : 'Fold diagram',
                id: FoldButtons.Fold,
            },
        ];
    }

    fold() {
        this.diagram.context.container.setAttribute('data-folded', 'true');

        updateDiagramSize(
            this.diagram.context,
            this.diagram.context.size,
            this.diagram.plugin.settings.data.diagrams.size,
            this.diagram.plugin.context.inLivePreviewMode
        );

        this.controlPanel.hide(TriggerType.FOLD);
    }

    unfold() {
        this.diagram.context.container.setAttribute('data-folded', 'false');

        updateDiagramSize(
            this.diagram.context,
            this.diagram.context.size,
            this.diagram.plugin.settings.data.diagrams.size,
            this.diagram.plugin.context.inLivePreviewMode
        );

        this.controlPanel.show(TriggerType.FOLD);
    }

    protected get supportedTriggers(): number {
        return (
            super.supportedTriggers &
            ~TriggerType.FOLD &
            ~TriggerType.SERVICE_HIDING &
            ~TriggerType.FOCUS &
            ~TriggerType.MOUSE
        );
    }
}
