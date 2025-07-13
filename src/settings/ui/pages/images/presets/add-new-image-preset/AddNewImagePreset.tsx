import { t, tf } from '@/lang';

import { FC, useState } from 'react';

import { OSetting } from '@obsidian-devkit/native-react-components';
import { Platform } from 'obsidian';

import { useSettingsContext } from '../../../../core/SettingsContext';
import { useUnitsHistoryContext } from '../context/HistoryContext';
import { useUnitsManagerContext } from '../context/UnitsManagerContext';
import { useUnitsValidation } from '../hooks/useUnitsValidation';
import UserGuideModal from './modals/UserGuideModal';

const AddNewImagePreset: FC = () => {
    const { plugin } = useSettingsContext();
    const [guideOpen, setGuideOpen] = useState(false);
    const {
        validateSelector,
        validateBoth,
        validateName,
        processValidationOnSave,
    } = useUnitsValidation();

    const [name, setName] = useState('');
    const [selector, setSelector] = useState('');
    const [nameError, setNameError] = useState('');
    const [selectorError, setSelectorError] = useState('');

    const { units, saveUnits } = useUnitsManagerContext();

    const { updateUndoStack } = useUnitsHistoryContext();

    const handleAddUnit = async (): Promise<void> => {
        debugger;
        const validationResult = validateBoth(name, selector);

        const validated = processValidationOnSave(validationResult);
        if (!validated) {
            return;
        }

        const oldUnits = [...units];

        const newUnit = {
            name: name,
            selector: selector,
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
            tf(
                t.settings.pages.images.presets.addNewImagePreset.undoStack
                    .addAction,
                {
                    name: newUnit.name,
                    selector: newUnit.selector,
                }
            )
        );
        plugin.showNotice(
            t.settings.pages.images.presets.addNewImagePreset.notice
                .newConfigAdded
        );
        setName('');
        setSelector('');
    };

    const onKeyDown = async (e: React.KeyboardEvent) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            await handleAddUnit();
        }
    };

    return (
        <>
            <OSetting
                name={t.settings.pages.images.presets.addNewImagePreset.header}
                heading
                noBorder
                desc={t.settings.pages.images.presets.addNewImagePreset.desc}
            />

            <OSetting>
                <input
                    id={'unit-name'}
                    type={'text'}
                    className={nameError.trim() ? 'invalid' : ''}
                    placeholder={
                        t.settings.pages.images.presets.addNewImagePreset
                            .placeholders.name
                    }
                    aria-label={nameError}
                    onChange={(e) => {
                        const value = e.target.value;
                        setName(value);
                        const validationResult = validateName(value);
                        setNameError(validateName(name).tooltip);
                    }}
                    onKeyDown={onKeyDown}
                />

                <input
                    id={'unit-selector'}
                    type={'text'}
                    className={selectorError.trim() ? 'invalid' : ''}
                    aria-label={selectorError}
                    placeholder={
                        t.settings.pages.images.presets.addNewImagePreset
                            .placeholders.selector
                    }
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelector(value);
                        const validationResult = validateSelector(value);
                        setSelectorError(validationResult.tooltip);
                    }}
                    onKeyDown={onKeyDown}
                />

                <button
                    aria-label={
                        t.settings.pages.images.presets.addNewImagePreset
                            .tooltips.saveButton
                    }
                    onClick={handleAddUnit}
                    data-icon={'save'}
                />

                {Platform.isDesktopApp && (
                    <button
                        aria-label={
                            t.settings.pages.images.presets.addNewImagePreset
                                .tooltips.infoButton
                        }
                        onClick={() => {
                            setGuideOpen(true);
                        }}
                        data-icon={'info'}
                    />
                )}
            </OSetting>

            {guideOpen && (
                <UserGuideModal onClose={() => setGuideOpen(false)} />
            )}
        </>
    );
};

export default AddNewImagePreset;
