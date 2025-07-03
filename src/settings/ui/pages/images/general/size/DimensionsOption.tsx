import { t, tf } from '@/lang';

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { setTooltip, TextComponent } from 'obsidian';

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
    const hasValidationErrorsRef = useRef(false);

    const [heightUnit, setHeightUnit] = useState(initialOptions.height.type);
    const [widthUnit, setWidthUnit] = useState(initialOptions.width.type);

    const heightValueRef = useRef(initialOptions.height.value);
    const widthValueRef = useRef(initialOptions.width.value);

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

    const validateDimensionInput = useCallback(
        (
            inputEl: HTMLInputElement,
            field: 'width' | 'height',
            unit: DimensionType
        ): void => {
            const value = inputEl.value;
            const isValid = isDimensionInValidRange(value, unit);

            if (!isValid) {
                inputEl.addClass('invalid');
                setTooltip(inputEl, getErrorMessage(field, unit));
                hasValidationErrorsRef.current = true;
            } else {
                inputEl.removeClass('invalid');
                setTooltip(inputEl, '');
                hasValidationErrorsRef.current = false;
            }
        },
        []
    );

    const validateAllFields = (
        widthInput: HTMLInputElement,
        heightInput: HTMLInputElement
    ) => {
        const widthValid = isDimensionInValidRange(widthInput.value, widthUnit);
        const heightValid = isDimensionInValidRange(
            heightInput.value,
            heightUnit
        );
        return widthValid && heightValid;
    };

    useEffect(() => {
        const widthInput = inputsRef.current?.querySelector(
            '#input-width'
        ) as HTMLInputElement | null;
        const heightInput = inputsRef.current?.querySelector(
            '#input-height'
        ) as HTMLInputElement | null;

        if (widthInput?.value) {
            validateDimensionInput(widthInput, 'width', widthUnit);
        }

        if (heightInput?.value) {
            validateDimensionInput(heightInput, 'height', heightUnit);
        }
    }, [widthUnit, heightUnit]);

    const handleSave = async () => {
        if (!inputsRef.current) {
            return;
        }

        const widthInput = inputsRef.current.querySelector(
            '#input-width'
        ) as HTMLInputElement;
        const heightInput = inputsRef.current.querySelector(
            '#input-height'
        ) as HTMLInputElement;

        const isValid = validateAllFields(widthInput, heightInput);

        if (!isValid) {
            plugin.showNotice(
                t.settings.pages.images.general.size.validation.fixErrors
            );
            return;
        }

        const inputWidth = parseInt(widthInput.value, 10);
        const inputHeight = parseInt(heightInput.value, 10);

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
            plugin.settings.data.units.size.folded = initialOptions;
        } else {
            plugin.settings.data.units.size.expanded = initialOptions;
        }

        await plugin.settings.saveSettings();
        plugin.showNotice(
            t.settings.pages.images.general.size.validation.savedSuccessfully
        );
    };

    const onKeyDown = async (e: React.KeyboardEvent) => {
        if (e.code === 'Enter') {
            if (!inputsRef.current) {
                return;
            }

            const isAnyFocused =
                !!inputsRef.current.querySelector('input:focus');
            if (isAnyFocused) {
                e.preventDefault();
                await handleSave();
            }
        }
    };

    return (
        <>
            <ReactObsidianSetting
                name={getName()}
                multiDesc={(multiDesc) => {
                    multiDesc.addDescriptions(getDesc());
                    return multiDesc;
                }}
                noBorder={true}
            />

            <div
                onKeyDown={onKeyDown}
                ref={inputsRef}
            >
                <ReactObsidianSetting
                    texts={[
                        (inputHeight): TextComponent => {
                            const parent = inputHeight.inputEl
                                .parentElement as HTMLElement;
                            inputHeight.inputEl.id = 'input-height';
                            const label = document.createElement('label');
                            label.textContent =
                                t.settings.pages.images.general.size.labels.height;
                            parent.insertBefore(label, inputHeight.inputEl);
                            inputHeight.setValue(
                                heightValueRef.current.toString()
                            );
                            inputHeight.setPlaceholder(
                                t.settings.pages.images.general.size
                                    .placeholders.height
                            );
                            inputHeight.onChange((value) => {
                                const replaced = value.replace(/\D/, '');
                                inputHeight.setValue(replaced);
                                heightValueRef.current = parseInt(replaced, 10);

                                validateDimensionInput(
                                    inputHeight.inputEl,
                                    'height',
                                    heightUnit
                                );
                            });
                            return inputHeight;
                        },
                        (inputWidth): TextComponent => {
                            const wrapper = inputWidth.inputEl
                                .parentElement as HTMLElement;
                            inputWidth.inputEl.id = 'input-width';
                            const label = document.createElement('label');
                            label.textContent =
                                t.settings.pages.images.general.size.labels.width;
                            wrapper.insertBefore(label, inputWidth.inputEl);

                            inputWidth.setValue(
                                widthValueRef.current.toString()
                            );
                            inputWidth.setPlaceholder(
                                t.settings.pages.images.general.size
                                    .placeholders.width
                            );
                            inputWidth.onChange((value) => {
                                const replaced = value.replace(/\D/, '');
                                inputWidth.setValue(replaced);
                                widthValueRef.current = parseInt(replaced, 10);

                                validateDimensionInput(
                                    inputWidth.inputEl,
                                    'width',
                                    widthUnit
                                );
                            });
                            return inputWidth;
                        },
                    ]}
                    dropdowns={[
                        (dropdown) => {
                            dropdown.addOptions({ px: 'px', '%': '%' });
                            dropdown.setValue(heightUnit);
                            dropdown.onChange((value) => {
                                setHeightUnit(value as DimensionType);
                            });
                            return dropdown;
                        },
                        (dropdown) => {
                            dropdown.addOptions({ px: 'px', '%': '%' });
                            dropdown.setValue(widthUnit);
                            dropdown.onChange((value) => {
                                setWidthUnit(value as DimensionType);
                            });
                            return dropdown;
                        },
                    ]}
                    buttons={[
                        (button) => {
                            button.setIcon('save');
                            button.setTooltip(
                                t.settings.pages.images.general.size
                                    .saveButtonTooltip
                            );
                            button.onClick(handleSave);
                            return button;
                        },
                    ]}
                />
            </div>
        </>
    );
};

export default DimensionsOption;
