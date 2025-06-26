import { ImageConfig } from '../../../../../../../types/interfaces';

export interface UnitOptionsProps {
    unitIndex: number;
    onClose: () => void;
    onChanges: (state: ImageConfig[], description: string) => void;
}
