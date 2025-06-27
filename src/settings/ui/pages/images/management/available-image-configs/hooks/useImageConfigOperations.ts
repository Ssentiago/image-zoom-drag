import { t } from '@/lang';

import { useMemo } from 'react';

import { useSettingsContext } from '../../../../../core/SettingsContext';
import { useUnitsHistoryContext } from '../../context/HistoryContext';
import { useUnitsManagerContext } from '../../context/UnitsManagerContext';
import { useUnitsValidation } from '../../hooks/useUnitsValidation';

export const useImageConfigOperations = () => {
    const { plugin } = useSettingsContext();
    const { validateBoth, processBothValidation } = useUnitsValidation();
    const { units, saveUnits } = useUnitsManagerContext();
    const { updateUndoStack } = useUnitsHistoryContext();
    const actionL = useMemo(
        () =>
            t.settings.pages.images.management.availableImageConfigs.item
                .actions,
        [plugin]
    );

    const handleDelete = async (index: number) => {
        const oldUnits = [...units];
        const newUnits = [...units];
        const deleted = newUnits[index];
        newUnits.splice(index, 1);

        await saveUnits(newUnits);
        updateUndoStack(
            oldUnits,
            actionL.delete.$format({
                name: deleted.name,
                selector: deleted.selector,
            })
        );
    };

    const handleToggle = async (index: number, value: boolean) => {
        const oldUnits = JSON.parse(JSON.stringify(units));
        units[index].on = value;
        await saveUnits([...units]);
        const action = value ? actionL.enable : actionL.disable;
        const undoDesc = action.$format({
            name: units[index].name,
        });
        updateUndoStack(oldUnits, undoDesc);
    };

    const handleSaveEditing = async (index: number) => {
        const oldUnit = units[index];

        const editingNameInput: HTMLInputElement | null =
            document.querySelector('#editing-name-input');
        const editingSelectorInput: HTMLInputElement | null =
            document.querySelector('#editing-selector-input');
        if (!editingNameInput || !editingSelectorInput) {
            return;
        }

        const validationResult = validateBoth(
            editingNameInput.value,
            editingSelectorInput.value,
            oldUnit
        );
        const validated = processBothValidation(
            editingNameInput,
            editingSelectorInput,
            validationResult
        );

        if (validated) {
            const oldName = oldUnit.name;
            const oldSelector = oldUnit.selector;
            const nameChanged = oldName !== editingNameInput.value;
            const selectorChanged = oldSelector !== editingSelectorInput.value;
            units[index].name = editingNameInput.value;
            units[index].selector = editingSelectorInput.value;
            await saveUnits([...units]);
            editingNameInput.removeAttribute('id');
            editingSelectorInput.removeAttribute('id');

            const changes = [];
            if (nameChanged) {
                changes.push(
                    actionL.changes.name.$format({
                        old: oldName,
                        new: units[index].name,
                    })
                );
            }
            if (selectorChanged) {
                changes.push(
                    actionL.changes.selector.$format({
                        old: oldSelector,
                        new: units[index].selector,
                    })
                );
            }

            updateUndoStack(
                units,
                actionL.edit.$format({
                    name: units[index].name,
                    changes: changes.join('\n'),
                })
            );
        }
        return validated;
    };

    return {
        handleDelete,
        handleToggle,
        handleSaveEditing,
    };
};
