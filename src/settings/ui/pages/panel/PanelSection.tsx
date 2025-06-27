import { t } from '@/lang';

import { FC } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { ButtonComponent } from 'obsidian';
import { Route, Switch, useLocation } from 'wouter';

import { MiniNavbar } from './PanelSection.styled';
import Management from './management/Management';
import Settings from './settings/Settings';

const PanelSection: FC = () => {
    const [location, setLocation] = useLocation();

    const navigate = (path: string) => setLocation(path);

    const isSettingsActive = location === '/panel/settings' || location === '/';
    const isManagementActive = location === '/panel/management';

    return (
        <>
            <MiniNavbar>
                <ReactObsidianSetting
                    buttons={[
                        (button): ButtonComponent => {
                            button.setIcon('settings');
                            button.setTooltip(
                                t.settings.pages.panels.miniNavbar
                                    .settingsButtonTooltip
                            );
                            button.onClick(async () => {
                                navigate('/panel/settings');
                            });
                            if (isSettingsActive) {
                                button.setClass('button-active');
                            }
                            return button;
                        },

                        (button): ButtonComponent => {
                            button.setIcon('folder-plus');
                            button.setTooltip(
                                t.settings.pages.panels.miniNavbar
                                    .managementButtonTooltip
                            );
                            button.onClick(async () => {
                                navigate('/panel/management');
                            });
                            if (isManagementActive) {
                                button.setClass('button-active');
                            }
                            return button;
                        },
                    ]}
                />
            </MiniNavbar>

            <Switch location={location}>
                <Route path=''>{() => <Settings />}</Route>
                <Route path='/settings'>{() => <Settings />}</Route>
                <Route path='/management'>{() => <Management />}</Route>
            </Switch>
        </>
    );
};

export default PanelSection;
