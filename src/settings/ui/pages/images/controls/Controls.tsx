import Layout from '@/settings/ui/pages/images/controls/layout/Layout';
import Visibility from '@/settings/ui/pages/images/controls/visibility/Visibility';

import React from 'react';

import { useSettingsContext } from '../../../core/SettingsContext';

const Controls: React.FC = () => {
    return (
        <>
            <Visibility />
            <Layout />
        </>
    );
};

export default Controls;
