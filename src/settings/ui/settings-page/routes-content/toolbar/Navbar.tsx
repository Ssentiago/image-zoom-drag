import { FC } from 'react';

import { NavLink } from 'react-router-dom';

import { NavbarContainer, NavbarTab, NavbarTabs } from './Navbar.styled';

const Navbar: FC = () => (
    <NavbarContainer>
        <NavbarTabs>
            <NavbarTab
                as={NavLink}
                to={'/images'}
                draggable={false}
            >
                Images
            </NavbarTab>
            <NavbarTab
                as={NavLink}
                to={'/panel'}
                draggable={false}
            >
                Panel
            </NavbarTab>
            <NavbarTab
                as={NavLink}
                to={'/debug/'}
                draggable={false}
            >
                Debug
            </NavbarTab>
            <NavbarTab
                as={NavLink}
                to={'/about'}
                draggable={false}
            >
                About
            </NavbarTab>
        </NavbarTabs>
    </NavbarContainer>
);

export default Navbar;
