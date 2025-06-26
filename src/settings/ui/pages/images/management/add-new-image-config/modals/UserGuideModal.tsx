import React from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from '@obsidian-devkit/native-react-components';

import { t } from '../../../../../../../lang';
import { useUserGuideVideo } from './hooks/useUserGuideVideo';
import { UserGuideModalProps } from './typing/interfaces';

const UserGuideModal: React.FC<UserGuideModalProps> = ({ onClose }) => {
    const { isLoading, videoUrl } = useUserGuideVideo();

    return (
        <ReactObsidianModal
            title={
                t.settings.pages.images.management.addNewImageConfig
                    .userGuideModal.header
            }
            onClose={() => onClose()}
        >
            <>
                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.management.addNewImageConfig
                            .userGuideModal.howItWorks.name
                    }
                    setHeading={true}
                />

                <ReactObsidianSetting
                    multiDesc={(multiDesc) => {
                        multiDesc.addDescriptions(
                            t.settings.pages.images.management.addNewImageConfig
                                .userGuideModal.howItWorks.desc
                        );
                        return multiDesc;
                    }}
                />

                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.management.addNewImageConfig
                            .userGuideModal.workingModes.name
                    }
                    setHeading={true}
                />
                <ReactObsidianSetting
                    multiDesc={(multiDesc) => {
                        multiDesc.addDescriptions(
                            t.settings.pages.images.management.addNewImageConfig
                                .userGuideModal.howItWorks.desc
                        );
                        return multiDesc;
                    }}
                />

                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.management.addNewImageConfig
                            .userGuideModal.customSelectors.name
                    }
                    setHeading={true}
                    desc={
                        t.settings.pages.images.management.addNewImageConfig
                            .userGuideModal.customSelectors.desc
                    }
                />

                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.management.addNewImageConfig
                            .userGuideModal.findingSelectors.name
                    }
                    multiDesc={(multiDesc) => {
                        multiDesc.addDescriptions(
                            t.settings.pages.images.management.addNewImageConfig
                                .userGuideModal.findingSelectors.desc
                        );
                        return multiDesc;
                    }}
                />

                {isLoading && (
                    <p>
                        {
                            t.settings.pages.images.management.addNewImageConfig
                                .userGuideModal.video.loading
                        }
                    </p>
                )}
                {!isLoading && videoUrl && (
                    <video
                        src={videoUrl}
                        controls={true}
                        autoPlay={false}
                        style={{ width: '100%', maxHeight: '400px' }}
                    />
                )}
                {!isLoading && !videoUrl && (
                    <p>
                        {
                            t.settings.pages.images.management.addNewImageConfig
                                .userGuideModal.video.failed
                        }
                    </p>
                )}
            </>
        </ReactObsidianModal>
    );
};
export default UserGuideModal;
