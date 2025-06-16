import React from 'react';

import { Platform } from 'obsidian';

import Navbar from './Navbar';
import ResetSettings from './ResetSettings';
import {
    DesktopResetButtonWrapper,
    DesktopToolbar,
    MobileResetButtonWrapper,
} from './Toolbar.styled';

/**
 * The settings page toolbar.
 *
 * On desktop, it displays the navbar in the center of the page and the reset
 * settings button on the right. On mobile, it displays the reset settings button
 * on the right and the navbar below it.
 * @returns The toolbar element.
 */
const Toolbar: React.FC = (): React.ReactElement => {
    if (Platform.isDesktopApp) {
        return (
            <DesktopToolbar>
                <Navbar />
                <DesktopResetButtonWrapper>
                    <ResetSettings />
                </DesktopResetButtonWrapper>
            </DesktopToolbar>
        );
    }

    return (
        <>
            <MobileResetButtonWrapper>
                <ResetSettings />
            </MobileResetButtonWrapper>
            <Navbar />
        </>
    );
};

export default Toolbar;
