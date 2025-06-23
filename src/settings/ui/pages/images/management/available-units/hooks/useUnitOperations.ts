import { createSettingsProxy } from '../../../../../../proxy/settings-proxy';
import { useSettingsContext } from '../../../../../core/SettingsContext';
import { useUnitsHistoryContext } from '../../context/HistoryContext';
import { useUnitsManagerContext } from '../../context/UnitsManagerContext';
import { useUnitsValidation } from '../../hooks/useUnitsValidation';

export const useUnitOperations = () => {
    const { plugin } = useSettingsContext();
    const { validateBoth, processBothValidation } = useUnitsValidation();
    const { units, saveUnits } = useUnitsManagerContext();
    const { updateUndoStack } = useUnitsHistoryContext();

    const handleDelete = async (index: number) => {
        const oldUnits = [...units];
        const newUnits = [...units];
        const deleted = newUnits[index];
        newUnits.splice(index, 1);

        await saveUnits(newUnits);
        updateUndoStack(
            oldUnits,
            `Delete unit\n\`Name: ${deleted.name}\nSelector: ${deleted.selector}\``
        );
    };

    const handleToggle = async (index: number, value: boolean) => {
        const oldUnits = createSettingsProxy(
            plugin,
            JSON.parse(JSON.stringify(units)),
            [plugin.settings.events.units.configs]
        );
        units[index].on = value;
        await saveUnits([...units]);
        updateUndoStack(
            oldUnits,
            `${value ? 'Enable' : 'Disable'} ${units[index].name} unit`
        );
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
                changes.push(`name: "${oldName}" → "${units[index].name}"`);
            }
            if (selectorChanged) {
                changes.push(
                    `selector: "${oldSelector}" → "${units[index].selector}"`
                );
            }

            updateUndoStack(
                units,
                `Edit unit "${units[index].name}":\n${changes.join('\n')}`
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
