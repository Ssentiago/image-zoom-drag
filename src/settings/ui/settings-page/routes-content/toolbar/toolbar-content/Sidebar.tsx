import { t } from '@/lang';
import {
    CollapsibleSection,
    Overlay,
    Section,
    SectionHeader,
    SidebarButton,
    SidebarContainer,
    SidebarContent,
} from '@/settings/ui/settings-page/routes-content/toolbar/toolbar-content/Sidebar.styled';
import { SidebarSections } from '@/settings/ui/settings-page/routes-content/toolbar/toolbar-content/types/constants';

import { FC, useEffect, useState } from 'react';

import { ChevronDown, ChevronRight, MenuIcon } from 'lucide-react';
import { useLocation } from 'wouter';

const Sidebar: FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<
        Record<SidebarSections, boolean>
    >({
        images: false,
        panels: false,
    });

    const toggleSection = (section: SidebarSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const [location, setLocation] = useLocation();
    const navigate = (path: string) => setLocation(path);

    useEffect(() => {
        const interactifySettings = document.querySelector(
            '.interactify-settings'
        );
        if (interactifySettings) {
            interactifySettings.classList.toggle('sidebar-open', isSidebarOpen);
        }
    }, [isSidebarOpen]);

    return (
        <>
            <SidebarButton
                aria-label={t.settings.toolbar.sidebar.tooltip}
                onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
                <MenuIcon size={18} />
            </SidebarButton>

            {isSidebarOpen && (
                <>
                    <Overlay onClick={() => setIsSidebarOpen(false)} />

                    <SidebarContainer>
                        <SidebarContent>
                            <Section
                                onClick={() =>
                                    toggleSection(SidebarSections.IMAGES)
                                }
                            >
                                <SectionHeader>
                                    Images
                                    {expandedSections.images ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </SectionHeader>
                            </Section>

                            <CollapsibleSection
                                $expanded={expandedSections.images}
                            >
                                <Section
                                    $nested
                                    $active={[
                                        '/images/general',
                                        '/images',
                                    ].includes(location)}
                                    onClick={() => navigate('/images/general')}
                                >
                                    General
                                </Section>
                                <Section
                                    $nested
                                    $active={location === '/images/presets'}
                                    onClick={() => navigate('/images/presets')}
                                >
                                    Presets
                                </Section>

                                <Section
                                    $nested
                                    $active={location === '/images/controls'}
                                    onClick={() => navigate('/images/controls')}
                                >
                                    Controls
                                </Section>
                                <Section
                                    $nested
                                    $active={location === '/images/layout'}
                                    onClick={() => navigate('/images/layout')}
                                >
                                    Layout
                                </Section>
                            </CollapsibleSection>

                            <Section
                                onClick={() => navigate('/debug')}
                                $active={location === '/debug'}
                            >
                                Debug
                            </Section>
                            <Section
                                onClick={() => navigate('/about')}
                                $active={location === '/about'}
                            >
                                About
                            </Section>
                        </SidebarContent>
                    </SidebarContainer>
                </>
            )}
        </>
    );
};

export default Sidebar;
