import { UnitConfig } from '../../../../../../../types/interfaces';

export interface UnitOptionsProps {
    unitIndex: number;
    onClose: () => void;
    onChanges: (state: UnitConfig[], description: string) => void;
}
