import { t } from '@/lang';

import React from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from '@obsidian-devkit/native-react-components';

import PanelLayout from '../panel-layout/PanelLayout';

interface LayoutModalProps {
    onClose: () => void;
    title: string;
}

const PanelLayoutModal: React.FC<LayoutModalProps> = ({ onClose, title }) => {
    return (
        <ReactObsidianModal
            onClose={onClose}
            title={title}
        >
            <ReactObsidianSetting
                name={
                    t.settings.pages.images.layout.controlsLayout.modal
                        .panelConfig.name
                }
                desc={
                    t.settings.pages.images.layout.controlsLayout.modal
                        .panelConfig.desc
                }
                setHeading={true}
                noBorder={true}
            />
            <ReactObsidianSetting
                name={
                    t.settings.pages.images.layout.controlsLayout.modal
                        .availablePanels.name
                }
                multiDesc={(multiDesc) => {
                    multiDesc.addDescriptions(
                        t.settings.pages.images.layout.controlsLayout.modal
                            .availablePanels.desc
                    );
                    return multiDesc;
                }}
                noBorder={true}
            />
            <ReactObsidianSetting
                name={
                    t.settings.pages.images.layout.controlsLayout.modal.howTo
                        .name
                }
                multiDesc={(multiDesc) => {
                    multiDesc.addDescriptions(
                        t.settings.pages.images.layout.controlsLayout.modal
                            .howTo.desc
                    );
                    return multiDesc;
                }}
            />
            <PanelLayout />
        </ReactObsidianModal>
    );
};

export default PanelLayoutModal;
