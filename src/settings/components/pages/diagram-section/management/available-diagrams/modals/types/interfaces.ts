import { DiagramData } from '../../../../../../../types/interfaces';

export interface DiagramOptionsProps {
    diagramIndex: number;
    onClose: () => void;
    onChanges: (state: DiagramData[], description: string) => void;
}
