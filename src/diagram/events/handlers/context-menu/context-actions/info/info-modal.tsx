import { FC } from 'react';

import {
    ReactObsidianModal,
    ReactObsidianSetting,
} from 'react-obsidian-setting';

import { DiagramInfo } from './info';

interface DiagramInfoProps {
    info: DiagramInfo;
    onClose: () => void;
}

const InfoModal: FC<DiagramInfoProps> = ({ info, onClose }) => {
    return (
        <ReactObsidianModal
            title='Diagram Properties'
            onClose={onClose}
            width='500px'
            maxHeight='80vh'
        >
            {/* General Info */}
            <ReactObsidianSetting
                name='General Information'
                setHeading={true}
            />

            <ReactObsidianSetting
                name='Name'
                desc={info.name}
            />

            <ReactObsidianSetting
                name='Selector'
                desc={info.selector}
            />

            <ReactObsidianSetting
                name='Status'
                desc={info.enabled ? 'Enabled' : 'Disabled'}
            />

            <ReactObsidianSetting
                name='Element type'
                desc={info.elementType}
            />

            {/* Dimensions */}
            <ReactObsidianSetting
                name='Dimensions'
                setHeading={true}
            />

            <ReactObsidianSetting
                name='Width'
                desc={`${info.dimensions.width}px`}
            />

            <ReactObsidianSetting
                name='Height'
                desc={`${info.dimensions.height}px`}
            />

            {/* Source Location */}
            <ReactObsidianSetting
                name='Source Location'
                setHeading={true}
            />

            <ReactObsidianSetting
                name='Start line'
                desc={info.sourceLocation.lineStart.toString()}
            />

            <ReactObsidianSetting
                name='End line'
                desc={info.sourceLocation.lineEnd.toString()}
            />

            <ReactObsidianSetting
                name='Lines count'
                desc={info.sourceLocation.linesCount.toString()}
            />

            {/* Panels */}
            {info.panels.length > 0 && (
                <>
                    <ReactObsidianSetting
                        name='Panels'
                        setHeading={true}
                    />

                    {info.panels.map((panel, index) => (
                        <ReactObsidianSetting
                            key={`${index}-${panel.name}`}
                            name={panel.name}
                            desc={panel.enabled ? '✓ Enabled' : '✗ Disabled'}
                        />
                    ))}
                </>
            )}
        </ReactObsidianModal>
    );
};

export default InfoModal;
