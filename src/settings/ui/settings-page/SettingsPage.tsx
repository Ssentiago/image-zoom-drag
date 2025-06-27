import { useSettingsContext } from '@/settings/ui/core/SettingsContext';

import { FC } from 'react';

import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';

import RoutesContent from './routes-content/RoutesContent';

const SettingsPage: FC = () => {
    const { reloadCount, currentPath } = useSettingsContext();

    const { hook } = memoryLocation({ path: currentPath });

    return (
        <Router
            hook={hook}
            key={reloadCount}
        >
            <RoutesContent />
        </Router>
    );
};

export default SettingsPage;
