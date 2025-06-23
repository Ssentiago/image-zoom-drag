import InteractiveElement from '../../interactiveElement';
import { TriggerType } from '../../types/constants';

export interface IControlPanel {
    diagram: InteractiveElement;
    controlPanel: HTMLElement;
    initialize: () => void;
    show(triggerType: TriggerType): void;
    hide(triggerType: TriggerType): void;
    hasVisiblePanels: boolean;
}
