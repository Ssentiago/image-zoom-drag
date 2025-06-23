import { createContext, useContext, useMemo } from 'react';

import { useUnitsManager } from '../hooks/useUnitsManager';
import {
    UnitManagerContextProps,
    UnitsManagerProviderProps,
} from './typing/interfaces';

const UnitsManagerContext = createContext<UnitManagerContextProps | undefined>(
    undefined
);

export const UnitsManagerProvider = ({
    children,
}: UnitsManagerProviderProps) => {
    const { units, saveUnits } = useUnitsManager();

    const contextValue = useMemo(
        () => ({
            units,
            saveUnits,
        }),
        [units, saveUnits]
    );

    return (
        <UnitsManagerContext.Provider value={contextValue}>
            {children}
        </UnitsManagerContext.Provider>
    );
};

export const useUnitsManagerContext = (): UnitManagerContextProps => {
    const context = useContext(UnitsManagerContext);
    if (context === undefined) {
        throw new Error(
            'useUnitsManagerContext must be used within a UnitsManagerProvider'
        );
    }
    return context;
};
