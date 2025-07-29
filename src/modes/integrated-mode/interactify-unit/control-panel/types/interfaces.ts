import InteractifyUnit from '../../interactify-unit';
import { TriggerType } from '../../types/constants';

export interface IControlPanel {
    unit: InteractifyUnit;
    controlPanel: HTMLElement;
    canRender: boolean;
    initialize: () => void;
    show(triggerType: TriggerType): void;
    hide(triggerType: TriggerType): void;
    hasVisiblePanels: boolean;
}
