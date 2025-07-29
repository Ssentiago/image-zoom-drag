import Controls from '@/settings/ui/pages/images/controls/Controls';
import General from '@/settings/ui/pages/images/general/General';
import Presets from '@/settings/ui/pages/images/presets/Presets';
import { UnitsManagerProvider } from '@/settings/ui/pages/images/presets/context/UnitsManagerContext';

import { FC } from 'react';

import { Route, Switch, useLocation } from 'wouter';

const Images: FC = () => {
    const [location, _] = useLocation();

    return (
        <UnitsManagerProvider>
            <Switch location={location}>
                <Route path='/general'>{() => <General />}</Route>
                <Route path='/presets'>{() => <Presets />}</Route>
                <Route path='/controls'>{() => <Controls />}</Route>
                <Route path=''>{() => <General />}</Route>{' '}
            </Switch>
        </UnitsManagerProvider>
    );
};
export default Images;
