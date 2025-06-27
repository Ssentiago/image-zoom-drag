import { FC } from 'react';

import { Link, useLocation } from 'wouter';

import { NavbarContainer, NavbarTab, NavbarTabs } from './Navbar.styled';

const Navbar: FC = () => {
    const [location] = useLocation();

    return (
        <NavbarContainer>
            <NavbarTabs>
                <NavbarTab
                    as={Link}
                    to={'/images'}
                    draggable={false}
                    $active={location.startsWith('/images')}
                >
                    Images
                </NavbarTab>
                <NavbarTab
                    as={Link}
                    to={'/panel'}
                    draggable={false}
                    $active={location.startsWith('/panel')}
                >
                    Panel
                </NavbarTab>
                <NavbarTab
                    as={Link}
                    to={'/debug/'}
                    draggable={false}
                    $active={location.startsWith('/debug')}
                >
                    Debug
                </NavbarTab>
                <NavbarTab
                    as={Link}
                    to={'/about'}
                    draggable={false}
                    $active={location === '/about'}
                >
                    About
                </NavbarTab>
            </NavbarTabs>
        </NavbarContainer>
    );
};

export default Navbar;
