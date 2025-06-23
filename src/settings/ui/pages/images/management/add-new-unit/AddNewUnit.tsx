import { FC, useRef, useState } from 'react';

import {
    ButtonComponent,
    ExtraButtonComponent,
    Platform,
    TextComponent,
} from 'obsidian';
import {
    MultiDescComponent,
    ReactObsidianSetting,
} from 'react-obsidian-setting';

import { useSettingsContext } from '../../../../core/SettingsContext';
import { useUnitsHistoryContext } from '../context/HistoryContext';
import { useUnitsManagerContext } from '../context/UnitsManagerContext';
import { useUnitsValidation } from '../hooks/useUnitsValidation';
import UserGuideModal from './modals/UserGuideModal';

const AddNewUnit: FC = () => {
    const { plugin } = useSettingsContext();
    const [guideOpen, setGuideOpen] = useState(false);
    const {
        validateSelector,
        validateBoth,
        validateName,
        processSelectorValidation,
        processNameValidation,
        processBothValidation,
    } = useUnitsValidation();

    const { units, saveUnits } = useUnitsManagerContext();

    const { updateUndoStack } = useUnitsHistoryContext();
    const addingUnitWrapperRef = useRef<HTMLInputElement>(null);

    const handleAddUnit = async (): Promise<void> => {
        if (addingUnitWrapperRef.current === null) {
            return;
        }
        const nameInput = addingUnitWrapperRef.current.querySelector(
            '#unit-name'
        ) as HTMLInputElement | null;

        const selectorInput = addingUnitWrapperRef.current.querySelector(
            '#unit-selector'
        ) as HTMLInputElement | null;

        if (!nameInput || !selectorInput) {
            return;
        }

        const validationResult = validateBoth(
            nameInput.value,
            selectorInput.value
        );

        const validated = processBothValidation(
            nameInput,
            selectorInput,
            validationResult
        );
        if (!validated) {
            return;
        }

        const oldUnits = [...units];

        const newUnit = {
            name: nameInput.value,
            selector: selectorInput.value,
            on: true,
            panels: {
                move: {
                    on: true,
                },
                zoom: {
                    on: true,
                },
                service: {
                    on: true,
                },
            },
        };

        const newUnits = [...units, newUnit];

        await saveUnits(newUnits);
        updateUndoStack(
            oldUnits,
            `Add image config\nName: ${newUnit.name}\nSelector: ${newUnit.selector}`
        );
        plugin.showNotice('New image config was added');
        nameInput.value = '';
        selectorInput.value = '';
    };

    const onKeyDown = async (e: React.KeyboardEvent) => {
        if (e.code === 'Enter') {
            if (addingUnitWrapperRef.current === null) {
                return;
            }

            const isAnyInputsFocused =
                !!addingUnitWrapperRef.current.querySelector('input:focus');
            if (isAnyInputsFocused) {
                e.preventDefault();
                await handleAddUnit();
            }
        }
    };

    return (
        <div
            onKeyDown={onKeyDown}
            ref={addingUnitWrapperRef}
        >
            <ReactObsidianSetting
                name={'Add new image config'}
                setHeading
                noBorder
                desc='Here you can configure which images will receive enhanced controls and UI.'
                addMultiDesc={(multiDesc: MultiDescComponent) => {
                    multiDesc.addDescriptions([
                        'Adding a Image Config:',
                        '1. Enter a unique name using only Latin letters, numbers and `-` (A-Z, a-z, 0-9, -)',
                        '2. Specify a valid CSS selector for your image',

                        'Once added, matching units will get:',
                        '• Mouse and keyboard navigation',
                        '• Additional control buttons',

                        'Note: Red border indicates invalid input - hover to see details',
                    ]);
                    return multiDesc;
                }}
            />
            <ReactObsidianSetting
                addTexts={[
                    (name): TextComponent => {
                        name.inputEl.id = 'unit-name';
                        name.setPlaceholder('Example Unit');
                        name.onChange((text) => {
                            name.setValue(text);
                            const validationResult = validateName(
                                name.getValue()
                            );
                            processNameValidation(
                                name.inputEl,
                                validationResult
                            );
                        });
                        return name;
                    },
                    (selector): TextComponent => {
                        selector.inputEl.id = 'unit-selector';
                        selector.setPlaceholder('.example-unit');
                        selector.onChange((text) => {
                            selector.setValue(text);
                            const validationResult = validateSelector(
                                selector.getValue()
                            );
                            processSelectorValidation(
                                selector.inputEl,
                                validationResult
                            );
                        });
                        return selector;
                    },
                ]}
                addButtons={[
                    (button): ButtonComponent => {
                        button.setIcon('save');
                        button.setTooltip('Add this unit');
                        button.onClick(async () => {
                            await handleAddUnit();
                        });
                        return button;
                    },
                ]}
                addExtraButtons={[
                    Platform.isDesktopApp &&
                        ((extra): ExtraButtonComponent => {
                            extra.setIcon('info');
                            extra.setTooltip(
                                'Click for more information on how the plugin works and how you can find image unit selectors'
                            );
                            extra.onClick(() => {
                                setGuideOpen(true);
                            });
                            return extra;
                        }),
                ]}
            />

            {guideOpen && (
                <UserGuideModal onClose={() => setGuideOpen(false)} />
            )}
        </div>
    );
};

export default AddNewUnit;
