import { ReactNode } from 'react';

import { DiagramData } from '../../../../../../types/interfaces';

export interface DiagramManagerContextProps {
    diagrams: DiagramData[];
    saveDiagrams: (newDiagrams: DiagramData[]) => Promise<void>;
}

export interface DiagramManagerProviderProps {
    children: ReactNode;
}
