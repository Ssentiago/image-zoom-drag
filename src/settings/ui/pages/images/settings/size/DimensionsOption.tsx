import React, {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { setTooltip, TextComponent } from 'obsidian';
import { ReactObsidianSetting } from 'react-obsidian-setting';

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

const getRangeMessage = (unit: DimensionType) =>
    dimensionSpec[unit].rangeMessage;
const isDimensionInValidRange = (
    value: string,
    unit: DimensionType
): boolean => {
    const n = parseInt(value, 10);
    const { min, max } = dimensionSpec[unit];
    return n >= min && n <= max;
};

const getErrorMessage = (field: 'width' | 'height', unit: DimensionType) =>
    `Invalid ${field}. Please enter number in range ${getRangeMessage(unit)}.`;

const DimensionsOption: FC<DimensionsOptionProps> = ({
    type,
    initialOptions,
}) => {
    const { plugin } = useSettingsContext();
    const hasValidationErrorsRef = useRef(false);

    const [heightUnit, setHeightUnit] = useState(initialOptions.height.unit);
    const [widthUnit, setWidthUnit] = useState(initialOptions.width.unit);

    const heightValueRef = useRef(initialOptions.height.value);
    const widthValueRef = useRef(initialOptions.width.value);

    const inputsRef = useRef<HTMLDivElement>(null);

    const prefix = useMemo(
        () => (type === ComponentType.Folded ? 'Folded' : 'Expanded'),
        [type]
    );

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
            plugin.showNotice('Please fix validation errors');
            return;
        }

        const inputWidth = parseInt(widthInput.value, 10);
        const inputHeight = parseInt(heightInput.value, 10);

        if (
            inputWidth === initialOptions.width.value &&
            inputHeight === initialOptions.height.value &&
            widthUnit === initialOptions.width.unit &&
            heightUnit === initialOptions.height.unit
        ) {
            plugin.showNotice('Nothing to save');
            return;
        }

        initialOptions.width.value = inputWidth;
        initialOptions.height.value = inputHeight;
        initialOptions.width.unit = widthUnit;
        initialOptions.height.unit = heightUnit;

        if (type === ComponentType.Folded) {
            plugin.settings.data.units.size.folded = initialOptions;
        } else {
            plugin.settings.data.units.size.expanded = initialOptions;
        }

        await plugin.settings.saveSettings();
        plugin.showNotice('Saved successfully');
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
                name={`${prefix} image container size`}
                addMultiDesc={(multiDesc) => {
                    multiDesc.addDescriptions([
                        `Set the container dimensions for ${prefix.toLowerCase()} state.`,
                        `px: 100-1000, %: 10-100`,
                        'Click Save button or press Enter to apply changes.',
                    ]);
                    return multiDesc;
                }}
                noBorder={true}
            />

            <div
                onKeyDown={onKeyDown}
                ref={inputsRef}
            >
                <ReactObsidianSetting
                    addTexts={[
                        (inputHeight): TextComponent => {
                            const parent = inputHeight.inputEl
                                .parentElement as HTMLElement;
                            inputHeight.inputEl.id = 'input-height';
                            const label = document.createElement('label');
                            label.textContent = 'Height:';
                            parent.insertBefore(label, inputHeight.inputEl);
                            inputHeight.setValue(
                                heightValueRef.current.toString()
                            );
                            inputHeight.setPlaceholder('height');
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
                            label.textContent = 'Width:';
                            wrapper.insertBefore(label, inputWidth.inputEl);

                            inputWidth.setValue(
                                widthValueRef.current.toString()
                            );
                            inputWidth.setPlaceholder('width');
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
                    addDropdowns={[
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
                    addButtons={[
                        (button) => {
                            button.setIcon('save');
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
