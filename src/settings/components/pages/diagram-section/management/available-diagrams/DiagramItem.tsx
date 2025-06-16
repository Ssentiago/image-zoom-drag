import React, { FC, useRef } from 'react';

import {
    ButtonComponent,
    ExtraButtonComponent,
    TextComponent,
    ToggleComponent,
} from 'obsidian';
import { ReactObsidianSetting } from 'react-obsidian-setting';

import { useDiagramValidation } from '../hooks/useDiagramValidation';
import { useDiagramOperations } from './hooks/useDiagramOperations';
import { DiagramItemProps } from './types/interfaces';

export const DiagramItem: FC<DiagramItemProps> = ({
    diagram,
    index,
    modeState,
    setModeState,
}) => {
    const {
        validateName,
        validateSelector,
        processNameValidation,
        processSelectorValidation,
    } = useDiagramValidation();

    const { handleSaveEditing, handleDelete, handleToggle } =
        useDiagramOperations();

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
                        nameInput.setValue(diagram.name);
                        nameInput.inputEl.id = 'editing-name-input';
                        nameInput.onChange((value) => {
                            const result = validateName(value, diagram);
                            processNameValidation(nameInput.inputEl, result);
                        });
                        return nameInput;
                    },
                    (selectorInput) => {
                        selectorInput.setValue(diagram.selector);
                        selectorInput.inputEl.id = 'editing-selector-input';
                        selectorInput.onChange((value) => {
                            const validationResult = validateSelector(
                                value,
                                diagram
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
                        button.setTooltip(`Save changes for ${diagram.name}?`);
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
            name={diagram.name}
            desc={diagram.selector}
            addToggles={[
                (toggle: ToggleComponent): ToggleComponent => {
                    toggle.setValue(diagram.on);
                    toggle.setTooltip(
                        `${diagram.on ? 'Disable' : 'Enable'} ${diagram.name} diagram`
                    );
                    toggle.onChange(async (value) => {
                        await handleToggle(index, value);
                    });
                    return toggle;
                },
            ]}
            addButtons={[
                diagram.name !== 'Default' &&
                    ((button: ButtonComponent): ButtonComponent => {
                        button.setIcon('edit');
                        button.setTooltip(`Edit ${diagram.name} diagram`);
                        button.onClick(async () => {
                            setModeState({
                                index,
                                mode: 'edit',
                            });
                        });
                        return button;
                    }),
                diagram.name !== 'Default' &&
                    ((button: ButtonComponent): ButtonComponent => {
                        button.setIcon('trash');
                        button.setTooltip(`Delete ${diagram.name} diagram`);
                        button.onClick(async () => {
                            await handleDelete(index);
                        });
                        return button;
                    }),
            ]}
            addExtraButtons={[
                (button: ExtraButtonComponent): ExtraButtonComponent => {
                    button.setTooltip(`Options for ${diagram.name} diagram`);
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
