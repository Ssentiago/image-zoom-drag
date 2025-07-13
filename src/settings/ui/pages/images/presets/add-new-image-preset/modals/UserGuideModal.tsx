import { t } from '@/lang';
import { UserGuideModalProps } from '@/settings/ui/pages/images/presets/add-new-image-preset/modals/types/interfaces';

import React from 'react';

import { OModal, OSetting } from '@obsidian-devkit/native-react-components';

import { useUserGuideVideo } from './hooks/useUserGuideVideo';

const UserGuideModal: React.FC<UserGuideModalProps> = ({ onClose }) => {
    const { isLoading, videoUrl } = useUserGuideVideo();

    return (
        <OModal
            title={
                t.settings.pages.images.presets.addNewImagePreset.userGuideModal
                    .header
            }
            onClose={() => onClose()}
        >
            <>
                <OSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.howItWorks.name
                    }
                    desc={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.howItWorks.desc
                    }
                />

                <OSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.workingModes.name
                    }
                    desc={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.workingModes.desc
                    }
                />
                <OSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.howItWorks.name
                    }
                    desc={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.howItWorks.desc
                    }
                />

                <OSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.customSelectors.name
                    }
                    heading={true}
                    desc={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.customSelectors.desc
                    }
                />

                <OSetting
                    name={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.findingSelectors.name
                    }
                    desc={
                        t.settings.pages.images.presets.addNewImagePreset
                            .userGuideModal.findingSelectors.desc
                    }
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
        </OModal>
    );
};
export default UserGuideModal;
