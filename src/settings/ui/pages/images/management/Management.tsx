import { FC } from 'react';

import AddNewUnit from './add-new-unit/AddNewUnit';
import AvailableUnits from './available-units/AvailableUnits';
import { UnitsHistoryProvider } from './context/HistoryContext';
import {
    UnitsManagerProvider,
    useUnitsManagerContext,
} from './context/UnitsManagerContext';

const Management: FC = () => {
    const { units, saveUnits } = useUnitsManagerContext();

    return (
        <UnitsHistoryProvider
            state={units}
            updateState={saveUnits}
        >
            <AddNewUnit />
            <AvailableUnits />
        </UnitsHistoryProvider>
    );
};

export default Management;
