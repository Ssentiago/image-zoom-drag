import { DefaultSettings } from '../../../../../../types/interfaces';
import { ComponentType } from './constants';

export interface DimensionsOptionProps {
    type: ComponentType;
    initialOptions:
        | DefaultSettings['diagrams']['size']['folded']
        | DefaultSettings['diagrams']['size']['expanded'];
}
