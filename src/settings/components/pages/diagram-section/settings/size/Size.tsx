import { FC } from 'react';

import { ReactObsidianSetting } from 'react-obsidian-setting';

import { useSettingsContext } from '../../../../core/SettingsContext';
import DimensionsOption from './DimensionsOption';
import { ComponentType } from './types/constants';

const Size: FC = () => {
    const { plugin } = useSettingsContext();
    return (
        <>
            <ReactObsidianSetting
                name={'Diagram Size'}
                addMultiDesc={(multidesc) => {
                    multidesc.addDescriptions([
                        'Note: You need to reopen all the open Markdown views with diagrams in them to apply these settings.',
                    ]);
                    return multidesc;
                }}
                setHeading={true}
            />

            <DimensionsOption
                type={ComponentType.Expanded}
                initialOptions={plugin.settings.data.diagrams.size.expanded}
            />
            <DimensionsOption
                type={ComponentType.Folded}
                initialOptions={plugin.settings.data.diagrams.size.folded}
            />
        </>
    );
};

export default Size;
