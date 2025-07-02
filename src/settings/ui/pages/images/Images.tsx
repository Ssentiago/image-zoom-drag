import { t } from '@/lang';

import { FC, useEffect } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { ButtonComponent } from 'obsidian';
import { Route, Switch, useLocation } from 'wouter';

import { MiniNavbar } from './Images.styled';
import Management from './management/Management';
import { UnitsManagerProvider } from './management/context/UnitsManagerContext';
import Settings from './settings/Settings';

const Images: FC = () => {
    const [location, setLocation] = useLocation();
    const navigate = (path: string) => setLocation(path);

    useEffect(() => {}, [location]);

    return (
        <UnitsManagerProvider>
            <MiniNavbar>
                <ReactObsidianSetting
                    buttons={[
                        (button): ButtonComponent => {
                            button.setIcon('settings');
                            button.setTooltip(
                                t.settings.pages.images.miniNavbar
                                    .settingsButtonTooltip
                            );
                            button.onClick(async () => {
                                navigate('/settings');
                            });
                            if (location === '/' || location === '/settings') {
                                button.setClass('button-active');
                            }
                            return button;
                        },
                        (button): ButtonComponent => {
                            button.setIcon('folder-plus');
                            button.setTooltip(
                                t.settings.pages.images.miniNavbar
                                    .managementButtonTooltip
                            );
                            button.onClick(async () => {
                                navigate('/management');
                            });
                            if (location === '/management') {
                                button.setClass('button-active');
                            }
                            return button;
                        },
                    ]}
                />
            </MiniNavbar>
            <Switch location={location}>
                <Route path='/management'>{() => <Management />}</Route>
                <Route path='/settings'>{() => <Settings />}</Route>
                <Route path=''>{() => <Settings />}</Route>{' '}
            </Switch>
        </UnitsManagerProvider>
    );
};
export default Images;
