import React from 'react';

import Folding from './folding/Folding';
import Interactive from './interactive/Interactive';
import Size from './size/Size';

const General: React.FC = (): React.ReactElement => {
    return (
        <>
            <Interactive />
            <Size />
            <Folding />
        </>
    );
};

export default General;
