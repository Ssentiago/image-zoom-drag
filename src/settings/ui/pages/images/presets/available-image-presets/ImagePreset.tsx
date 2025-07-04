import { t, tf } from '@/lang';
import { ImageConfigs } from '@/modes/integrated-mode/interactify-unit/types/constants';

import React, { FC, useRef } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import {
    ButtonComponent,
    ExtraButtonComponent,
    TextComponent,
    ToggleComponent,
} from 'obsidian';

import { useUnitsValidation } from '../hooks/useUnitsValidation';
import { useImageConfigOperations } from './hooks/useImageConfigOperations';
import { UnitItemProps } from './types/interfaces';

export const ImagePreset: FC<UnitItemProps> = ({
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
                        button.setTooltip(
                            t.settings.pages.images.presets
                                .availableImageConfigs.item.buttons.cancel
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
                        button.setTooltip(
                            tf(
                                t.settings.pages.images.presets
                                    .availableImageConfigs.item.buttons.save,
                                { name: unit.name }
                            )
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
                            ? tf(
                                  t.settings.pages.images.presets
                                      .availableImageConfigs.item.toggle
                                      .disable,
                                  {
                                      name: unit.name,
                                  }
                              )
                            : tf(
                                  t.settings.pages.images.presets
                                      .availableImageConfigs.item.toggle.enable,
                                  {
                                      name: unit.name,
                                  }
                              )
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
                            tf(
                                t.settings.pages.images.presets
                                    .availableImageConfigs.item.buttons.edit,
                                {
                                    name: unit.name,
                                }
                            )
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
                            tf(
                                t.settings.pages.images.presets
                                    .availableImageConfigs.item.buttons.delete,
                                {
                                    name: unit.name,
                                }
                            )
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
                        tf(
                            t.settings.pages.images.presets
                                .availableImageConfigs.item.buttons.options,
                            { name: unit.name }
                        )
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
