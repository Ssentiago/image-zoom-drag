import React from 'react';

import Folding from './folding/Folding';
import Size from './size/Size';

const Settings: React.FC = (): React.ReactElement => {
    return (
        <>
            <Size />
            <Folding />
        </>
    );
};

export default Settings;
