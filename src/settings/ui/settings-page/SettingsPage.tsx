import { FC } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { useSettingsContext } from '../core/SettingsContext';
import RoutesContent from './routes-content/RoutesContent';

const SettingsPage: FC = () => {
    const { reloadCount, currentPath } = useSettingsContext();
    return (
        <MemoryRouter
            initialEntries={[currentPath]}
            key={reloadCount}
        >
            <RoutesContent />
        </MemoryRouter>
    );
};
export default SettingsPage;
