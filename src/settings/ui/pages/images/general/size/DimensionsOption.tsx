import { t, tf } from '@/lang';

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { OSetting } from '@obsidian-lib/native-react-components';

import { DimensionType } from '../../../../../types/definitions';
import { useSettingsContext } from '../../../../core/SettingsContext';
import { ComponentType } from './types/constants';
import { DimensionsOptionProps } from './types/interfaces';

const dimensionSpec = {
    px: {
        min: 100,
        max: 1000,
        label: 'px',
        rangeMessage: '100-1000px',
    },
    '%': {
        min: 10,
        max: 100,
        label: '%',
        rangeMessage: '10-100%',
    },
};

const isDimensionInValidRange = (
    value: string,
    unit: DimensionType
): boolean => {
    const n = parseInt(value, 10);
    const { min, max } = dimensionSpec[unit];
    return n >= min && n <= max;
};

const getErrorMessage = (field: 'width' | 'height', unit: DimensionType) => {
    const range =
        unit === 'px'
            ? dimensionSpec.px.rangeMessage
            : dimensionSpec['%'].rangeMessage;
    switch (field) {
        case 'width':
            return tf(
                t.settings.pages.images.general.size.validation.invalidWidth,
                {
                    range: range,
                }
            );
        case 'height':
            return tf(
                t.settings.pages.images.general.size.validation.invalidHeight,
                {
                    range: range,
                }
            );
    }
};

const DimensionsOption: FC<DimensionsOptionProps> = ({
    type,
    initialOptions,
    border,
}) => {
    const { plugin } = useSettingsContext();

    const [heightUnit, setHeightUnit] = useState(initialOptions.height.type);
    const [widthUnit, setWidthUnit] = useState(initialOptions.width.type);
    const [heightValue, setHeightValue] = useState(
        initialOptions.height.value.toString()
    );
    const [widthValue, setWidthValue] = useState(
        initialOptions.width.value.toString()
    );

    const [heightError, setHeightError] = useState('');
    const [widthError, setWidthError] = useState('');

    const inputsRef = useRef<HTMLDivElement>(null);

    const getName = useCallback(() => {
        switch (type) {
            case ComponentType.Expanded:
                return t.settings.pages.images.general.size.expanded.name;
            case ComponentType.Folded:
                return t.settings.pages.images.general.size.folded.name;
        }
    }, [type]);

    const getDesc = useCallback(() => {
        switch (type) {
            case ComponentType.Expanded:
                return t.settings.pages.images.general.size.expanded.desc;
            case ComponentType.Folded:
                return t.settings.pages.images.general.size.folded.desc;
        }
    }, [type]);

    const validateHeight = (value: string, unit: DimensionType) => {
        if (!isDimensionInValidRange(value, unit)) {
            setHeightError(getErrorMessage('height', unit));
            return false;
        }
        setHeightError('');
        return true;
    };

    const validateWidth = (value: string, unit: DimensionType) => {
        if (!isDimensionInValidRange(value, unit)) {
            setWidthError(getErrorMessage('width', unit));
            return false;
        }
        setWidthError('');
        return true;
    };

    const validateDimensionInput = useCallback(
        (
            value: string,
            field: 'width' | 'height',
            unit: DimensionType
        ): void => {
            field === 'height'
                ? validateHeight(value, unit)
                : validateWidth(value, unit);
        },
        []
    );

    useEffect(() => {
        validateDimensionInput(widthValue, 'width', widthUnit);
        validateDimensionInput(heightValue, 'height', heightUnit);
    }, [widthUnit, heightUnit]);

    const handleSave = async () => {
        const isHeightValid = validateHeight(heightValue, heightUnit);
        const isWidthValid = validateWidth(widthValue, widthUnit);

        if (!isHeightValid || !isWidthValid) {
            plugin.showNotice(
                t.settings.pages.images.general.size.validation.fixErrors
            );
            return;
        }

        const inputWidth = parseInt(widthValue, 10);
        const inputHeight = parseInt(heightValue, 10);

        if (
            inputWidth === initialOptions.width.value &&
            inputHeight === initialOptions.height.value &&
            widthUnit === initialOptions.width.type &&
            heightUnit === initialOptions.height.type
        ) {
            plugin.showNotice(
                t.settings.pages.images.general.size.validation.nothingToSave
            );
            return;
        }

        initialOptions.width.value = inputWidth;
        initialOptions.height.value = inputHeight;
        initialOptions.width.type = widthUnit;
        initialOptions.height.type = heightUnit;

        if (type === ComponentType.Folded) {
            plugin.settings.$.units.size.folded = initialOptions;
        } else {
            plugin.settings.$.units.size.expanded = initialOptions;
        }

        await plugin.settings.save();
        plugin.showNotice(
            t.settings.pages.images.general.size.validation.savedSuccessfully
        );
    };

    const onKeyDown = async (e: React.KeyboardEvent) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            await handleSave();
        }
    };

    return (
        <>
            <OSetting
                name={getName()}
                noBorder={true}
            />

            <OSetting>
                <label htmlFor={'height-input'}>Height</label>
                <input
                    id={'height-input'}
                    type='text'
                    value={heightValue}
                    onKeyDown={onKeyDown}
                    aria-label={
                        heightError || heightUnit === 'px'
                            ? '100-1000px'
                            : '10-100%'
                    }
                    className={heightError ? 'invalid' : ''}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/, '');
                        e.target.value = value;
                        setHeightValue(value);
                        validateHeight(value, heightUnit);
                    }}
                />
                <select
                    value={heightUnit}
                    onChange={(e) => {
                        const unit = e.target.value as DimensionType;
                        setHeightUnit(unit);
                        validateHeight(heightValue, unit);
                    }}
                >
                    <option value='px'>px</option>
                    <option value='%'>%</option>
                </select>

                <label htmlFor={'width-input'}>Width</label>
                <input
                    id={'width-input'}
                    type='text'
                    value={widthValue}
                    className={widthError ? 'invalid' : ''}
                    aria-label={
                        widthError || widthUnit === 'px'
                            ? '100-1000px'
                            : '10-100%'
                    }
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/, '');
                        e.target.value = value;
                        setWidthValue(value);
                        validateWidth(value, widthUnit);
                    }}
                />
                <select
                    value={widthUnit}
                    onChange={(e) => {
                        const unit = e.target.value as DimensionType;
                        setWidthUnit(unit);
                        validateWidth(widthValue, unit);
                    }}
                >
                    <option value='px'>px</option>
                    <option value='%'>%</option>
                </select>

                <button
                    onClick={handleSave}
                    data-icon={'save'}
                />
            </OSetting>
        </>
    );
};

export default DimensionsOption;
