import {
    MultiDescComponent,
    ReactObsidianSetting,
} from 'react-obsidian-setting';
import React, { useState } from 'react';
import { useSettingsContext } from '../../../../../../core/context';
import { ComponentType } from './typing/constanst';
import { ToggleComponent } from 'obsidian';
import { SmoothAnimatedItem } from '../../../../../../common/smooth-animated-item';

/**
 * A React component that renders two settings for the diagram size:
 * one for the expanded diagram and one for the folded diagram.
 *
 * It uses the `ReactObsidianSetting` component to render a setting with a
 * heading and two input fields for the width and height of the diagram.
 *
 * The component also handles the saving of the new values to the plugin
 * settings and updates the CSS properties.
 *
 * @returns The React component for the diagram size settings.
 */
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
} as const;

type DimensionUnit = keyof typeof dimensionSpec;

const getRangeMessage = (unit: DimensionUnit) =>
    dimensionSpec[unit].rangeMessage;

const isDimensionInValidRange = (
    value: string,
    unit: DimensionUnit
): boolean => {
    const n = parseInt(value, 10);
    const { min, max } = dimensionSpec[unit];
    return n >= min && n <= max;
};

const getErrorMessage = (field: 'width' | 'height', unit: DimensionUnit) =>
    `Invalid ${field}. Please enter number in range ${getRangeMessage(unit)}.`;

const getMinMaxByUnit = (unit: DimensionUnit) => ({
    min: dimensionSpec[unit].min.toString(),
    max: dimensionSpec[unit].max.toString(),
});

const DiagramSizes: React.FC = () => {
    const { plugin } = useSettingsContext();
    const [expandedHeight, setExpandedHeight] = useState(
        plugin.settings.diagramExpanded.height
    );
    const [expandedWidth, setExpandedWidth] = useState(
        plugin.settings.diagramExpanded.width
    );
    const [expandedHeightUnit, setExpandedHeightUnit] = useState(
        plugin.settings.diagramExpanded.heightUnit
    );
    const [expandedWidthUnit, setExpandedWidthUnit] = useState(
        plugin.settings.diagramExpanded.widthUnit
    );
    const [foldedHeight, setFoldedHeight] = useState(
        plugin.settings.diagramFolded.height
    );
    const [foldedWidth, setFoldedWidth] = useState(
        plugin.settings.diagramFolded.width
    );
    const [foldedHeightUnit, setFoldedHeightUnit] = useState(
        plugin.settings.diagramFolded.heightUnit
    );
    const [foldedWidthUnit, setFoldedWidthUnit] = useState(
        plugin.settings.diagramFolded.widthUnit
    );

    const isValidNumber = (value: string) => /^\d+$/.test(value);

    const createSettingInputs = (componentType: ComponentType) => {
        const prefix =
            componentType === ComponentType.Folded ? 'Folded' : 'Expanded';
        const height =
            componentType === ComponentType.Folded
                ? foldedHeight
                : expandedHeight;
        const width =
            componentType === ComponentType.Folded
                ? foldedWidth
                : expandedWidth;
        const heightUnit =
            componentType === ComponentType.Folded
                ? foldedHeightUnit
                : expandedHeightUnit;
        const widthUnit =
            componentType === ComponentType.Folded
                ? foldedWidthUnit
                : expandedWidthUnit;
        const setHeight =
            componentType === ComponentType.Folded
                ? setFoldedHeight
                : setExpandedHeight;
        const setWidth =
            componentType === ComponentType.Folded
                ? setFoldedWidth
                : setExpandedWidth;
        const setHeightUnit =
            componentType === ComponentType.Folded
                ? setFoldedHeightUnit
                : setExpandedHeightUnit;
        const setWidthUnit =
            componentType === ComponentType.Folded
                ? setFoldedWidthUnit
                : setExpandedWidthUnit;

        return (
            <ReactObsidianSetting
                name={`${prefix} diagram container size`}
                addMultiDesc={(multiDesc) => {
                    multiDesc.addDescriptions([
                        `Set the container dimensions for ${prefix.toLowerCase()} state.`,
                        `px: 100-1000, %: 10-100`,
                        'Click Save button to apply changes.',
                    ]);
                    return multiDesc;
                }}
                addTexts={[
                    (inputHeight) => {
                        const wrapper = inputHeight.inputEl.parentElement;
                        if (wrapper) {
                            const label = document.createElement('label');
                            label.textContent = 'Height:';
                            wrapper.insertBefore(label, inputHeight.inputEl);
                        }

                        inputHeight.setValue(height);
                        inputHeight.setPlaceholder('height');
                        inputHeight.inputEl.type = 'number';
                        const { min, max } = getMinMaxByUnit(heightUnit);
                        inputHeight.inputEl.min = min;
                        inputHeight.inputEl.max = max;
                        inputHeight.inputEl.ariaLabel = `${prefix} height`;
                        inputHeight.inputEl.onblur = () => {
                            if (!isValidNumber(inputHeight.getValue())) {
                                plugin.showNotice('Please enter valid number');
                            } else {
                                setHeight(inputHeight.getValue());
                            }
                        };
                        return inputHeight;
                    },
                    (inputWidth) => {
                        const wrapper = inputWidth.inputEl.parentElement;
                        if (wrapper) {
                            const label = document.createElement('label');
                            label.textContent = 'Width:';
                            wrapper.insertBefore(label, inputWidth.inputEl);
                        }

                        inputWidth.setValue(width);
                        inputWidth.setPlaceholder('width');
                        inputWidth.inputEl.type = 'number';
                        const { min, max } = getMinMaxByUnit(widthUnit);
                        inputWidth.inputEl.min = min;
                        inputWidth.inputEl.max = max;
                        inputWidth.inputEl.ariaLabel = `${prefix} width`;
                        inputWidth.inputEl.onblur = () => {
                            if (!isValidNumber(inputWidth.getValue())) {
                                plugin.showNotice('Please enter valid number');
                            } else {
                                setWidth(inputWidth.getValue());
                            }
                        };
                        return inputWidth;
                    },
                ]}
                addDropdowns={[
                    (dropdown) => {
                        dropdown.addOptions({ px: 'px', '%': '%' });
                        dropdown.setValue(heightUnit);
                        dropdown.onChange((value) => {
                            if (value === 'px' || value === '%') {
                                setHeightUnit(value);
                            }
                        });
                        return dropdown;
                    },
                    (dropdown) => {
                        dropdown.addOptions({ px: 'px', '%': '%' });
                        dropdown.setValue(widthUnit);
                        dropdown.onChange((value) => {
                            if (value === 'px' || value === '%') {
                                setWidthUnit(value);
                            }
                        });
                        return dropdown;
                    },
                ]}
                addButtons={[
                    (button) => {
                        button.setIcon('save');
                        button.onClick(async () => {
                            const heightInvalid =
                                !isValidNumber(height) ||
                                !isDimensionInValidRange(height, heightUnit);
                            const widthInvalid =
                                !isValidNumber(width) ||
                                !isDimensionInValidRange(width, widthUnit);

                            if (heightInvalid && widthInvalid) {
                                plugin.showNotice(
                                    `Invalid height and width.\nHeight must be ${getRangeMessage(heightUnit)}, width must be ${getRangeMessage(widthUnit)}.`
                                );
                                return;
                            }

                            if (heightInvalid) {
                                plugin.showNotice(
                                    getErrorMessage('height', heightUnit)
                                );
                                return;
                            }

                            if (widthInvalid) {
                                plugin.showNotice(
                                    getErrorMessage('width', widthUnit)
                                );
                                return;
                            }

                            if (componentType === ComponentType.Folded) {
                                plugin.settings.diagramFolded.height = height;
                                plugin.settings.diagramFolded.heightUnit =
                                    heightUnit;
                                plugin.settings.diagramFolded.width = width;
                                plugin.settings.diagramFolded.widthUnit =
                                    widthUnit;
                            } else {
                                plugin.settings.diagramExpanded.height = height;
                                plugin.settings.diagramExpanded.heightUnit =
                                    heightUnit;
                                plugin.settings.diagramExpanded.width = width;
                                plugin.settings.diagramExpanded.widthUnit =
                                    widthUnit;
                            }

                            await plugin.settingsManager.saveSettings();
                            plugin.showNotice('Saved successfully');
                        });
                        return button;
                    },
                ]}
                noBorder={true}
            />
        );
    };

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

            {createSettingInputs(ComponentType.Expanded)}
            {createSettingInputs(ComponentType.Folded)}
        </>
    );
};

export default DiagramSizes;
