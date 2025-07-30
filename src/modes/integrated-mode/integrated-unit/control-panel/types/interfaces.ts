import IntegratedUnit from '../../integrated-unit';
import { TriggerType } from '../../types/constants';

export interface IControlPanel {
    unit: IntegratedUnit;
    controlPanel: HTMLElement;
    canRender: boolean;
    initialize: () => void;
    show(triggerType: TriggerType): void;
    hide(triggerType: TriggerType): void;
    hasVisiblePanels: boolean;
}
