import { FC } from 'react';

import { NavLink } from 'react-router-dom';

import { NavbarContainer, NavbarTab, NavbarTabs } from './Navbar.styled';

const Navbar: FC = () => (
    <NavbarContainer>
        <NavbarTabs>
            <NavbarTab
                as={NavLink}
                to={'/diagram-section'}
                draggable={false}
            >
                Diagram
            </NavbarTab>
            <NavbarTab
                as={NavLink}
                to={'/panel-section'}
                draggable={false}
            >
                Panel
            </NavbarTab>
            <NavbarTab
                as={NavLink}
                to={'/Debug/'}
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
