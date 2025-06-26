import { FC } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { ButtonComponent } from 'obsidian';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { t } from '../../../../lang';
import { MiniNavbar } from './Images.styled';
import Management from './management/Management';
import { UnitsManagerProvider } from './management/context/UnitsManagerContext';
import Settings from './settings/Settings';

const Images: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
                                await navigate('/images/settings');
                            });
                            if (
                                location.pathname === '/images' ||
                                location.pathname === '/images/settings'
                            ) {
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
                                await navigate('/images/management');
                            });
                            if (location.pathname === '/images/management') {
                                button.setClass('button-active');
                            }
                            return button;
                        },
                    ]}
                />
            </MiniNavbar>
            <Routes location={location}>
                <Route
                    index
                    element={<Settings />}
                />
                <Route
                    path='settings'
                    element={<Settings />}
                />
                <Route
                    path='management'
                    element={<Management />}
                />
            </Routes>
        </UnitsManagerProvider>
    );
};
export default Images;
