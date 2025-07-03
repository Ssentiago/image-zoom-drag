import { t } from '@/lang';

import { FC } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';

import { useSettingsContext } from '../../../../core/SettingsContext';
import DimensionsOption from './DimensionsOption';
import { ComponentType } from './types/constants';

const Size: FC = () => {
    const { plugin } = useSettingsContext();
    return (
        <>
            <ReactObsidianSetting
                name={t.settings.pages.images.general.size.header}
                addMultiDesc={(multidesc) => {
                    multidesc.addDesc(
                        t.settings.pages.images.general.size.desc
                    );
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
                border
            />
        </>
    );
};

export default Size;
