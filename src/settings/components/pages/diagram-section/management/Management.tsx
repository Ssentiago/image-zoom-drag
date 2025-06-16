import { FC } from 'react';

import AddNewDiagram from './add-new-diagram/AddNewDiagram';
import AvailableDiagrams from './available-diagrams/AvailableDiagrams';
import {
    DiagramManagerProvider,
    useDiagramManagerContext,
} from './context/DiagramManagerContext';
import { DiagramHistoryProvider } from './context/HistoryContext';

const Management: FC = () => {
    const { diagrams, saveDiagrams } = useDiagramManagerContext();

    return (
        <DiagramHistoryProvider
            state={diagrams}
            updateState={saveDiagrams}
        >
            <AddNewDiagram />
            <AvailableDiagrams />
        </DiagramHistoryProvider>
    );
};

export default Management;
