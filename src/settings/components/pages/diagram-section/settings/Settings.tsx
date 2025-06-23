import React from 'react';

import Folding from './folding/Folding';
import Size from './size/Size';
import Interactive from './interactive/Interactive';

const Settings: React.FC = (): React.ReactElement => {
    return (
        <>
            <Interactive />
            <Size />
            <Folding />
        </>
    );
};

export default Settings;
