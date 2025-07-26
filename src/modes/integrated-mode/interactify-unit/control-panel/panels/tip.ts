import { BasePanel } from '@/modes/integrated-mode/interactify-unit/control-panel/panels/base-panel';
import { TipButtons } from '@/modes/integrated-mode/interactify-unit/control-panel/panels/types/constants';
import { ButtonsData } from '@/modes/integrated-mode/interactify-unit/control-panel/panels/types/interfaces';
import { IControlPanel } from '@/modes/integrated-mode/interactify-unit/control-panel/types/interfaces';

export default class TipPanel extends BasePanel<TipButtons> {
    buttons = new Map<TipButtons, ButtonsData>();

    constructor(controlPanel: IControlPanel) {
        super(controlPanel);
    }

    get enabled(): boolean {
        return true;
    }
    protected get cssClass(): string {
        return 'interactify-tip-panel';
    }

    protected get cssStyles(): object {
        return {
            position: 'absolute',
            left: '0%',
            top: '0%',
        };
    }
    protected getButtonsConfig(): {
        id: TipButtons;
        title: string;
        icon: string;
        action: () => void;
        dataAttributes?: { [key: string]: string };
        gridArea?: string;
    }[] {
        const { plugin } = this.unit;
        if (!plugin.userState.shouldShowTips || plugin.help.isHelpOpen) {
            return [];
        }
        return [
            {
                id: TipButtons.Ribbon,
                icon: 'ribbon',
                action: () => {
                    this.unit.plugin.help.showModal('minimal');
                },
                title: 'Tips',
            },
        ];
    }

    protected get supportedTriggers(): number {
        return super.supportedTriggers;
    }
}
