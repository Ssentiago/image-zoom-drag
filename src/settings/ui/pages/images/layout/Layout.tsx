import { t } from '@/lang';

import React from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';

import ButtonLayoutModal from './modals/ButtonLayoutModal';
import PanelLayoutModal from './modals/PanelLayoutModal';

const Layout: React.FC = () => {
    const [layoutModalOpen, setLayoutModalOpen] = React.useState(false);
    const [buttonModalOpen, setButtonModalOpen] = React.useState(false);

    return (
        <>
            <ReactObsidianSetting
                name={t.settings.pages.images.layout.controlsLayout.name}
                desc={t.settings.pages.images.layout.controlsLayout.desc}
                buttons={[
                    (button) => {
                        button.setIcon('layout');
                        button.setTooltip(
                            t.settings.pages.images.layout.controlsLayout
                                .tooltip
                        );
                        button.onClick(() => {
                            setLayoutModalOpen(true);
                        });
                        return button;
                    },
                ]}
            />
            <ReactObsidianSetting
                name={t.settings.pages.images.layout.buttonsLayout.name}
                desc={t.settings.pages.images.layout.buttonsLayout.desc}
                buttons={[
                    (button) => {
                        button.setIcon('panels-top-left');
                        button.setTooltip(
                            t.settings.pages.images.layout.buttonsLayout.tooltip
                        );
                        button.onClick(() => {
                            setButtonModalOpen(true);
                        });
                        return button;
                    },
                ]}
            />
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
