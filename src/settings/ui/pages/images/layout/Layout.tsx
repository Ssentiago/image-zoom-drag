import { t } from '@/lang';

import React from 'react';

import { OSetting } from '@obsidian-devkit/native-react-components';

import ButtonLayoutModal from './modals/ButtonLayoutModal';
import PanelLayoutModal from './modals/PanelLayoutModal';

const Layout: React.FC = () => {
    const [layoutModalOpen, setLayoutModalOpen] = React.useState(false);
    const [buttonModalOpen, setButtonModalOpen] = React.useState(false);

    return (
        <>
            <OSetting
                name={t.settings.pages.images.layout.controlsLayout.name}
                desc={t.settings.pages.images.layout.controlsLayout.desc}
            >
                <button
                    aria-label={
                        t.settings.pages.images.layout.controlsLayout.tooltip
                    }
                    onClick={() => {
                        setLayoutModalOpen(true);
                    }}
                    data-icon={'layout'}
                />
            </OSetting>

            <OSetting
                name={t.settings.pages.images.layout.buttonsLayout.name}
                desc={t.settings.pages.images.layout.buttonsLayout.desc}
            >
                <button
                    aria-label={
                        t.settings.pages.images.layout.buttonsLayout.tooltip
                    }
                    onClick={() => {
                        setButtonModalOpen(true);
                    }}
                    data-icon={'panels-top-left'}
                />
            </OSetting>

            {layoutModalOpen && (
                <PanelLayoutModal
                    onClose={() => setLayoutModalOpen(false)}
                    title={
                        t.settings.pages.images.layout.controlsLayout.modal
                            .title
                    }
                />
            )}
            {buttonModalOpen && (
                <ButtonLayoutModal
                    onClose={() => setButtonModalOpen(false)}
                    title={
                        t.settings.pages.images.layout.buttonsLayout.modal.title
                    }
                />
            )}
        </>
    );
};

export default Layout;
