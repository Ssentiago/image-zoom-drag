import Sidebar from '@/settings/ui/settings-page/routes-content/toolbar/toolbar-content/Sidebar';

import React from 'react';

import { ToolbarComponent } from './Toolbar.styled';
import ResetSettings from './toolbar-content/ResetSettings';

const Toolbar: React.FC = (): React.ReactElement => {
    return (
        <ToolbarComponent>
            <Sidebar />
            <ResetSettings />
        </ToolbarComponent>
    );
};

export default Toolbar;
