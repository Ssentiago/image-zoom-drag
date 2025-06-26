import React from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from '@obsidian-devkit/native-react-components';

import { t } from '../../../../../../lang';
import PanelLayout from '../panel-layout/PanelLayout';

interface LayoutModalProps {
    onClose: () => void;
    title: string;
}

const LayoutModal: React.FC<LayoutModalProps> = ({ onClose, title }) => {
    return (
        <ReactObsidianModal
            onClose={onClose}
            title={title}
        >
            <ReactObsidianSetting
                name={
                    t.settings.pages.panels.management.panelLayoutModal
                        .panelConfig.name
                }
                desc={
                    t.settings.pages.panels.management.panelLayoutModal
                        .panelConfig.desc
                }
                setHeading={true}
                noBorder={true}
            />
            <ReactObsidianSetting
                name={
                    t.settings.pages.panels.management.panelLayoutModal
                        .availablePanels.name
                }
                multiDesc={(multiDesc) => {
                    multiDesc.addDescriptions(
                        t.settings.pages.panels.management.panelLayoutModal
                            .availablePanels.desc
                    );
                    return multiDesc;
                }}
                noBorder={true}
            />
            <ReactObsidianSetting
                name={
                    t.settings.pages.panels.management.panelLayoutModal.howTo
                        .name
                }
                multiDesc={(multiDesc) => {
                    multiDesc.addDescriptions(
                        t.settings.pages.panels.management.panelLayoutModal
                            .howTo.desc
                    );
                    return multiDesc;
                }}
            />
            <PanelLayout />
        </ReactObsidianModal>
    );
};

export default LayoutModal;
