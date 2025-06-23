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
                name={'Image size'}
                addMultiDesc={(multidesc) => {
                    multidesc.addDescriptions([
                        'Note: You need to reopen all the open Markdown views with images in them to apply these settings.',
                    ]);
                    return multidesc;
                }}
                setHeading={true}
            />

            <DimensionsOption
                type={ComponentType.Expanded}
                initialOptions={plugin.settings.data.units.size.expanded}
            />
            <DimensionsOption
                type={ComponentType.Folded}
                initialOptions={plugin.settings.data.units.size.folded}
            />
        </>
    );
};

export default Size;
