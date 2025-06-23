import { FC } from 'react';

import { ButtonComponent } from 'obsidian';
import { ReactObsidianSetting } from 'react-obsidian-setting';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { MiniNavbar } from './PanelSection.styled';
import Management from './management/Management';
import Settings from './settings/Settings';

const PanelSection: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isSettingsActive =
        location.pathname === '/panel-section/settings' ||
        location.pathname === '/panel-section';
    const isManagementActive =
        location.pathname === '/panel-section/management';

    return (
        <>
            <MiniNavbar>
                <ReactObsidianSetting
                    addButtons={[
                        (button): ButtonComponent => {
                            button.setIcon('settings');
                            button.setTooltip('Panels Settings');
                            button.onClick(async () => {
                                await navigate('/panel-section/settings');
                            });
                            if (isSettingsActive) {
                                button.setClass('button-active');
                            }
                            return button;
                        },

                        (button): ButtonComponent => {
                            button.setIcon('folder-plus');
                            button.setTooltip('Panels Management');
                            button.onClick(async () => {
                                await navigate('/panel-section/management');
                            });
                            if (isManagementActive) {
                                button.setClass('button-active');
                            }
                            return button;
                        },
                    ]}
                />
            </MiniNavbar>

            <Routes>
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
        </>
    );
};

export default PanelSection;
