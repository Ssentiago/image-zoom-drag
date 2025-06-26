import { t } from '../../../lang';
import { updateUnitSize } from '../../helpers';
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
        return 'interactify-fold-panel';
    }

    getButtonsConfig() {
        const isFolded = this.unit.context.container.dataset.folded === 'true';
        const titleGetter = (state: 'folded' | 'expanded') =>
            state === 'folded'
                ? t.image.controlPanel.fold.fold.folded
                : t.image.controlPanel.fold.fold.expanded;

        return [
            {
                icon: isFolded ? 'unfold-vertical' : 'fold-vertical',
                action: (): void => {
                    const isFolded =
                        this.controlPanel.unit.context.container.dataset
                            .folded === 'true';

                    isFolded ? this.unfold() : this.fold();

                    const button = this.buttons.get(FoldButtons.Fold);

                    if (button) {
                        updateButton(
                            button.element,
                            isFolded ? 'fold-vertical' : 'unfold-vertical',
                            titleGetter(isFolded ? 'folded' : 'expanded')
                        );
                    }
                },
                title: titleGetter(isFolded ? 'folded' : 'expanded'),
                id: FoldButtons.Fold,
            },
        ];
    }

    fold() {
        this.unit.context.container.setAttribute('data-folded', 'true');

        updateUnitSize(
            this.unit.context,
            this.unit.context.size,
            this.unit.plugin.settings.data.units.size,
            this.unit.plugin.context.inLivePreviewMode
        );

        this.controlPanel.hide(TriggerType.FOLD);
    }

    unfold() {
        this.unit.context.container.setAttribute('data-folded', 'false');

        updateUnitSize(
            this.unit.context,
            this.unit.context.size,
            this.unit.plugin.settings.data.units.size,
            this.unit.plugin.context.inLivePreviewMode
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
