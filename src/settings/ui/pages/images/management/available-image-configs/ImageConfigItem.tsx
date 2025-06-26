import React, { FC, useMemo, useRef } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import {
    ButtonComponent,
    ExtraButtonComponent,
    TextComponent,
    ToggleComponent,
} from 'obsidian';

import { ImageConfigs } from '../../../../../../interactify-unit/types/constants';
import { t } from '../../../../../../lang';
import { useUnitsValidation } from '../hooks/useUnitsValidation';
import { useImageConfigOperations } from './hooks/useImageConfigOperations';
import { UnitItemProps } from './types/interfaces';

export const ImageConfigItem: FC<UnitItemProps> = ({
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

    const itemL = useMemo(
        () => t.settings.pages.images.management.availableImageConfigs.item,
        [unit]
    );

    const { handleSaveEditing, handleDelete, handleToggle } =
        useImageConfigOperations();

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
                texts={[
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
                buttons={[
                    (button): ButtonComponent => {
                        button.setIcon('circle-x');
                        button.setTooltip(itemL.buttons.cancel);
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
                        button.setTooltip(
                            itemL.buttons.save.$format({ name: unit.name })
                        );
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
            toggles={[
                (toggle: ToggleComponent): ToggleComponent => {
                    toggle.setValue(unit.on);
                    toggle.setTooltip(
                        unit.on
                            ? itemL.toggle.disable.$format({
                                  name: unit.name,
                              })
                            : itemL.toggle.enable.$format({
                                  name: unit.name,
                              })
                    );
                    toggle.onChange(async (value) => {
                        await handleToggle(index, value);
                    });
                    return toggle;
                },
            ]}
            buttons={[
                ![ImageConfigs.IMG_SVG, ImageConfigs.Default].contains(
                    unit.selector as ImageConfigs
                ) &&
                    ((button: ButtonComponent): ButtonComponent => {
                        button.setIcon('edit');
                        button.setTooltip(
                            itemL.buttons.edit.$format({
                                name: unit.name,
                            })
                        );
                        button.onClick(async () => {
                            setModeState({
                                index,
                                mode: 'edit',
                            });
                        });
                        return button;
                    }),
                ![ImageConfigs.IMG_SVG, ImageConfigs.Default].contains(
                    unit.selector as ImageConfigs
                ) &&
                    ((button: ButtonComponent): ButtonComponent => {
                        button.setIcon('trash');
                        button.setTooltip(
                            itemL.buttons.delete.$format({
                                name: unit.name,
                            })
                        );
                        button.onClick(async () => {
                            await handleDelete(index);
                        });
                        return button;
                    }),
            ]}
            extraButtons={[
                (button: ExtraButtonComponent): ExtraButtonComponent => {
                    button.setTooltip(
                        itemL.buttons.options.$format({ name: unit.name })
                    );
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
