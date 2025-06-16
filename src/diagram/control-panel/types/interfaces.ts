import Diagram from '../../diagram';
import { TriggerType } from '../../types/constants';

export interface IControlPanel {
    diagram: Diagram;
    controlPanel: HTMLElement;
    initialize: () => void;
    show(triggerType: TriggerType): void;
    hide(triggerType: TriggerType): void;
    hasVisiblePanels: boolean;
}
