import { ReactNode } from 'react';

import { UnitConfig } from '../../../../../../types/interfaces';

export interface UnitManagerContextProps {
    units: UnitConfig[];
    saveUnits: (newUnits: UnitConfig[]) => Promise<void>;
}

export interface UnitsManagerProviderProps {
    children: ReactNode;
}
