import { FC, useEffect, useState } from 'react';

import { Route, Routes, useLocation } from 'react-router-dom';

import About from '../../pages/about/About';
import Debug from '../../pages/debug/Debug';
import DiagramSection from '../../pages/diagram-section/DiagramSection';
import PanelSection from '../../pages/panel-section/PanelSection';
import { AnimatedRoutes } from './RoutesContent.styled';
import Toolbar from './toolbar/Toolbar';

const RoutesContent: FC = () => {
    const location = useLocation();
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
                <Routes location={displayLocation}>
                    <Route
                        path='/diagram-section/*'
                        element={<DiagramSection />}
                    />
                    <Route
                        path='/panel-section/*'
                        element={<PanelSection />}
                    />
                    <Route
                        path={'/debug/*'}
                        element={<Debug />}
                    />
                    <Route
                        path={'/about'}
                        element={<About />}
                    />
                </Routes>
            </AnimatedRoutes>
        </>
    );
};

export default RoutesContent;
