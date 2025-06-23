import React, { FC, useRef } from 'react';

import {
    ButtonComponent,
    ExtraButtonComponent,
    TextComponent,
    ToggleComponent,
} from 'obsidian';
import { ReactObsidianSetting } from 'react-obsidian-setting';

import { UnitConfigs } from '../../../../../../interactify-unit/types/constants';
import { useUnitsValidation } from '../hooks/useUnitsValidation';
import { useUnitOperations } from './hooks/useUnitOperations';
import { UnitItemProps } from './types/interfaces';

export const UnitItem: FC<UnitItemProps> = ({
    unit,
    index,
    modeState,
    setModeState,
}) => {
    const {
        validateName,
        validateSelector,
        processNameValidation,
        processSelectorValidation,
    } = useUnitsValidation();

    const { handleSaveEditing, handleDelete, handleToggle } =
        useUnitOperations();

    const editingItemRef = useRef<HTMLDivElement>(null);

    const onKeyDown = async (e: React.KeyboardEvent) => {
        if (e.code === 'Enter') {
            const editingItem = editingItemRef.current;
            if (!editingItem) {
                return;
            }

            const isAnyInputFocused =
                !!editingItem.querySelector('input:focus');
            if (isAnyInputFocused) {
                e.preventDefault();
                await handleSaveEditing(index);
            }
        }
    };

    return modeState.index === index && modeState.mode === 'edit' ? (
        <div
            onKeyDown={onKeyDown}
            ref={editingItemRef}
        >
            <ReactObsidianSetting
                addTexts={[
                    (nameInput): TextComponent => {
                        nameInput.setValue(unit.name);
                        nameInput.inputEl.id = 'editing-name-input';
                        nameInput.onChange((value) => {
                            const result = validateName(value, unit);
                            processNameValidation(nameInput.inputEl, result);
                        });
                        return nameInput;
                    },
                    (selectorInput) => {
                        selectorInput.setValue(unit.selector);
                        selectorInput.inputEl.id = 'editing-selector-input';
                        selectorInput.onChange((value) => {
                            const validationResult = validateSelector(
                                value,
                                unit
                            );
                            processSelectorValidation(
                                selectorInput.inputEl,
                                validationResult
                            );
                        });
                        return selectorInput;
                    },
                ]}
                addButtons={[
                    (button): ButtonComponent => {
                        button.setIcon('circle-x');
                        button.setTooltip(
                            'Cancel operation? All changes will be lost.'
                        );
                        button.onClick(() => {
                            setModeState({
                                index: -1,
                                mode: 'none',
                            });
                        });
                        return button;
                    },
                    (button): ButtonComponent => {
                        button.setIcon('save');
                        button.setTooltip(`Save changes for ${unit.name}?`);
                        button.onClick(async (cb) => {
                            await handleSaveEditing(index);
                            setModeState({
                                index: -1,
                                mode: 'none',
                            });
                        });
                        return button;
                    },
                ]}
            />
        </div>
    ) : (
        <ReactObsidianSetting
            name={unit.name}
            desc={unit.selector}
            addToggles={[
                (toggle: ToggleComponent): ToggleComponent => {
                    toggle.setValue(unit.on);
                    toggle.setTooltip(
                        `${unit.on ? 'Disable' : 'Enable'} ${unit.name} unit`
                    );
                    toggle.onChange(async (value) => {
                        await handleToggle(index, value);
                    });
                    return toggle;
                },
            ]}
            addButtons={[
                ![UnitConfigs.IMG_SVG, UnitConfigs.Default].contains(
                    unit.selector as UnitConfigs
                ) &&
                    ((button: ButtonComponent): ButtonComponent => {
                        button.setIcon('edit');
                        button.setTooltip(`Edit ${unit.name} unit`);
                        button.onClick(async () => {
                            setModeState({
                                index,
                                mode: 'edit',
                            });
                        });
                        return button;
                    }),
                ![UnitConfigs.IMG_SVG, UnitConfigs.Default].contains(
                    unit.selector as UnitConfigs
                ) &&
                    ((button: ButtonComponent): ButtonComponent => {
                        button.setIcon('trash');
                        button.setTooltip(`Delete ${unit.name} unit`);
                        button.onClick(async () => {
                            await handleDelete(index);
                        });
                        return button;
                    }),
            ]}
            addExtraButtons={[
                (button: ExtraButtonComponent): ExtraButtonComponent => {
                    button.setTooltip(`Options for ${unit.name} unit`);
                    button.onClick(() => {
                        setModeState({
                            index,
                            mode: 'options',
                        });
                    });
                    return button;
                },
            ]}
        />
    );
};
