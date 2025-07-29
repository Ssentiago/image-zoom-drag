import About from '@/settings/ui/pages/about/About';
import Debug from '@/settings/ui/pages/debug/Debug';
import {
    SRoutesContainer,
    SRoutesContent,
} from '@/settings/ui/settings-page/routes-content/RoutesContent.styled';

import { FC } from 'react';

import { Route, Switch, useLocation } from 'wouter';

import Images from '../../pages/images/Images';
import Toolbar from './toolbar/Toolbar';

const RoutesContent: FC = () => {
    const [location] = useLocation();

    return (
        <SRoutesContent>
            <Toolbar />
            <SRoutesContainer>
                <Switch location={location}>
                    <Route
                        path='/images'
                        nest
                    >
                        {() => <Images />}
                    </Route>
                    <Route path='/debug'>{() => <Debug />}</Route>
                    <Route path='/about'>{() => <About />}</Route>
                </Switch>
            </SRoutesContainer>
        </SRoutesContent>
    );
};

export default RoutesContent;
