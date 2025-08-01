import { t } from '@/lang';

import { FC } from 'react';

import { OSetting } from '@obsidian-lib/native-react-components';

import { useSettingsContext } from '../../../../core/SettingsContext';
import DimensionsOption from './DimensionsOption';
import { ComponentType } from './types/constants';

const Size: FC = () => {
    const { plugin } = useSettingsContext();
    return (
        <>
            <OSetting
                name={t.settings.pages.images.general.size.header}
                heading={true}
            />

            <DimensionsOption
                type={ComponentType.Expanded}
                initialOptions={plugin.settings.$.units.size.expanded}
            />
            <DimensionsOption
                type={ComponentType.Folded}
                initialOptions={plugin.settings.$.units.size.folded}
                border
            />
        </>
    );
};

export default Size;
