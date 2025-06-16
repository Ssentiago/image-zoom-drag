import { createContext, useContext, useMemo } from 'react';

import { useDiagramsManager } from '../hooks/useDiagramManager';
import {
    DiagramManagerContextProps,
    DiagramManagerProviderProps,
} from './typing/interfaces';

const DiagramManagerContext = createContext<
    DiagramManagerContextProps | undefined
>(undefined);

export const DiagramManagerProvider = ({
    children,
}: DiagramManagerProviderProps) => {
    const { diagrams, saveDiagrams } = useDiagramsManager();

    const contextValue = useMemo(
        () => ({
            diagrams,
            saveDiagrams,
        }),
        [diagrams, saveDiagrams]
    );

    return (
        <DiagramManagerContext.Provider value={contextValue}>
            {children}
        </DiagramManagerContext.Provider>
    );
};

export const useDiagramManagerContext = (): DiagramManagerContextProps => {
    const context = useContext(DiagramManagerContext);
    if (context === undefined) {
        throw new Error(
            'useDiagramManagerContext must be used within a DiagramManagerProvider'
        );
    }
    return context;
};
