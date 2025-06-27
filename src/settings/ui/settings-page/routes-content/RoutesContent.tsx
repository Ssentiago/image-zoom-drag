import { FC, useEffect, useState } from 'react';

import { Route, Switch, useLocation } from 'wouter';

import About from '../../pages/about/About';
import Debug from '../../pages/debug/Debug';
import Images from '../../pages/images/Images';
import PanelSection from '../../pages/panel/PanelSection';
import { AnimatedRoutes } from './RoutesContent.styled';
import Toolbar from './toolbar/Toolbar';

const RoutesContent: FC = () => {
    const [location] = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);

    const [transitionStage, setTransitionStage] = useState<
        'fadeIn' | 'fadeOut'
    >('fadeIn');

    useEffect(() => {
        if (location !== displayLocation) {
            setTransitionStage('fadeOut');
        }
    }, [location, displayLocation]);

    return (
        <>
            <Toolbar />
            <AnimatedRoutes
                $stage={transitionStage}
                className={transitionStage}
                onAnimationEnd={() => {
                    if (transitionStage === 'fadeOut') {
                        setTransitionStage('fadeIn');
                        setDisplayLocation(location);
                    }
                }}
            >
                <Switch location={displayLocation}>
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
                    <Route
                        path='/debug'
                        nest
                    >
                        {() => <Debug />}
                    </Route>
                    <Route path='/about'>{() => <About />}</Route>
                </Switch>
            </AnimatedRoutes>
        </>
    );
};

export default RoutesContent;
