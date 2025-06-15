import { FC } from 'react';

import { ButtonComponent } from 'obsidian';
import { ReactObsidianSetting } from 'react-obsidian-setting';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { MiniNavbar } from './DiagramSection.styled';
import Management from './management/Management';
import Settings from './settings/Settings';

const DiagramSection: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <MiniNavbar>
                <ReactObsidianSetting
                    addButtons={[
                        (button): ButtonComponent => {
                            button.setIcon('settings');
                            button.setTooltip('Settings');
                            button.onClick(async () => {
                                await navigate('/diagram-section/settings');
                            });
                            if (
                                location.pathname === '/diagram-section' ||
                                location.pathname ===
                                    '/diagram-section/settings'
                            ) {
                                button.setClass('button-active');
                            }
                            return button;
                        },
                        (button): ButtonComponent => {
                            button.setIcon('folder-plus');
                            button.setTooltip('Diagram Management');
                            button.onClick(async () => {
                                await navigate('/diagram-section/management');
                            });
                            if (
                                location.pathname ===
                                '/diagram-section/management'
                            ) {
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
        </>
    );
};
export default DiagramSection;
