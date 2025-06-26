import { FC } from 'react';

import AddNewImageConfig from './add-new-image-config/AddNewImageConfig';
import AvailableImageConfigs from './available-image-configs/AvailableImageConfigs';
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
            <AddNewImageConfig />
            <AvailableImageConfigs />
        </UnitsHistoryProvider>
    );
};

export default Management;
