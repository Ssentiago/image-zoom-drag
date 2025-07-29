import { ReactNode } from 'react';

import { ImageConfig } from '../../../../../../types/interfaces';

export interface UnitManagerContextProps {
    units: ImageConfig[];
    saveUnits: (newUnits: ImageConfig[]) => Promise<void>;
}

export interface UnitsManagerProviderProps {
    children: ReactNode;
}
