import { t } from '@/lang';
import { UserGuideModalProps } from '@/settings/ui/pages/images/presets/add-new-image-preset/modals/types/interfaces';

import React from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from '@obsidian-devkit/native-react-components';

import { useUserGuideVideo } from './hooks/useUserGuideVideo';

const UserGuideModal: React.FC<UserGuideModalProps> = ({ onClose }) => {
    const { isLoading, videoUrl } = useUserGuideVideo();

    return (
        <ReactObsidianModal
            title={
                t.settings.pages.images.presets.addNewImagePreset.userGuideModal
                    .header
            }
            onClose={() => onClose()}
        >
            <>
                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.howItWorks.name
                    }
                    multiDesc={(multiDesc) => {
                        multiDesc.addDescriptions(
                            t.settings.pages.images.presets.addNewImagePreset
                                .userGuideModal.howItWorks.desc
                        );
                        return multiDesc;
                    }}
                />

                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.workingModes.name
                    }
                    multiDesc={(m) =>
                        m.addDescriptions(
                            t.settings.pages.images.presets.addNewImagePreset
                                .userGuideModal.workingModes.desc
                        )
                    }
                />
                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.howItWorks.name
                    }
                    multiDesc={(multiDesc) => {
                        multiDesc.addDescriptions(
                            t.settings.pages.images.presets.addNewImagePreset
                                .userGuideModal.howItWorks.desc
                        );
                        return multiDesc;
                    }}
                />

                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.customSelectors.name
                    }
                    setHeading={true}
                    desc={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.customSelectors.desc
                    }
                />

                <ReactObsidianSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.findingSelectors.name
                    }
                    multiDesc={(multiDesc) => {
                        multiDesc.addDescriptions(
                            t.settings.pages.images.presets.addNewImagePreset
                                .userGuideModal.findingSelectors.desc
                        );
                        return multiDesc;
                    }}
                />

                {isLoading && (
                    <p>
                        {
                            t.settings.pages.images.presets.addNewImagePreset
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
                            t.settings.pages.images.presets.addNewImagePreset
                                .userGuideModal.video.failed
                        }
                    </p>
                )}
            </>
        </ReactObsidianModal>
    );
};
export default UserGuideModal;
