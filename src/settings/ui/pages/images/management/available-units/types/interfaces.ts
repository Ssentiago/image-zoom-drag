import { UnitConfig } from '../../../../../../types/interfaces';
import { mode } from './definitions';

export interface ModeState {
    mode: mode;
    index: number;
    data?: {
        [key: string]: any;
    };
}

export interface UnitItemProps {
    unit: UnitConfig;
    index: number;
    modeState: ModeState;
    setModeState: (modeState: ModeState) => void;
}
