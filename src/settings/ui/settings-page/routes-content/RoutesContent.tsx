import { FC } from 'react';

import { Route, Switch, useLocation } from 'wouter';

import About from '../../pages/about/About';
import Debug from '../../pages/debug/Debug';
import Images from '../../pages/images/Images';
import PanelSection from '../../pages/panel/PanelSection';
import Toolbar from './toolbar/Toolbar';

const RoutesContent: FC = () => {
    const [location] = useLocation();

    return (
        <>
            <Toolbar />
            <Switch location={location}>
                <Route
                    path='/images'
                    nest
                >
                    {() => <Images />}
                </Route>
                <Route
                    path='/panel'
                    nest
                >
                    {() => <PanelSection />}
                </Route>
                <Route path='/debug'>{() => <Debug />}</Route>
                <Route path='/about'>{() => <About />}</Route>
            </Switch>
        </>
    );
};

export default RoutesContent;
