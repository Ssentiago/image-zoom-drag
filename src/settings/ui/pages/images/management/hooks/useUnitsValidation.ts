import { useEffect, useMemo, useState } from 'react';

import { t } from '../../../../../../lang';
import { ImageConfig } from '../../../../../types/interfaces';
import { useSettingsContext } from '../../../../core/SettingsContext';
import { useUnitsManagerContext } from '../context/UnitsManagerContext';
import {
    UnitValidationResult,
    GlobalValidationResult,
} from './typing/interfaces';

// const unitRegexp = /^[\w-]+$/;

export const useUnitsValidation = () => {
    const { plugin } = useSettingsContext();
    const { units } = useUnitsManagerContext();
    const [unitNamesIndex, setUnitNamesIndex] = useState(new Set());
    const [unitSelectorsIndex, setUnitSelectorsIndex] = useState(new Set());

    const unitL = useMemo(
        () => t.settings.pages.images.management.unitsValidation,
        [plugin]
    );

    const updateUnitNameAndSelectors = (units: ImageConfig[]) => {
        const unitIndexData = {
            names: [] as string[],
            selectors: [] as string[],
        };
        units.forEach((item) => {
            unitIndexData.names.push(item.name);
            unitIndexData.selectors.push(item.selector);
        });
        setUnitNamesIndex(new Set(unitIndexData.names));
        setUnitSelectorsIndex(new Set(unitIndexData.selectors));
    };

    useEffect(() => {
        updateUnitNameAndSelectors(plugin.settings.data.units.configs);
        const handler = (payload: any) => {
            updateUnitNameAndSelectors(units);
        };

        plugin.settings.eventBus.on(
            plugin.settings.events.units.configs.$path,
            handler
        );

        return () => {
            plugin.settings.eventBus.off(
                plugin.settings.events.units.configs.$path,
                handler
            );
        };
    }, [units]);

    const testSelector = (selector: string) => {
        try {
            document.querySelector(selector);
            return { valid: true, err: undefined };
        } catch (err: any) {
            const parts = (err.message as string).split(':');
            const message = parts.slice(1).join(':').trim();
            return { valid: false, err: message };
        }
    };

    const validateName = (
        name: string,
        exclude?: ImageConfig
    ): UnitValidationResult => {
        if (!name.trim()) {
            return {
                empty: true,
                tooltip: '',
                valid: false,
            };
        }

        // if (!unitRegexp.test(name)) {
        //     return {
        //         valid: false,
        //         tooltip: 'Incorrect input. Should be only A-Za-z0-9-',
        //         empty: false,
        //     };
        // }

        if (unitNamesIndex.has(name) && (!exclude || exclude.name !== name)) {
            return {
                valid: false,
                tooltip: unitL.nameAlreadyExists,
                empty: false,
            };
        }

        return { valid: true, tooltip: '', empty: false };
    };

    const validateSelector = (
        selector: string,
        exclude?: ImageConfig
    ): UnitValidationResult => {
        if (!selector.trim()) {
            return {
                empty: true,
                tooltip: '',
                valid: false,
            };
        }

        const { valid, err } = testSelector(selector);
        if (!valid) {
            return {
                valid: false,
                tooltip: unitL.invalidSelectorPrefix.$format({
                    err: err ?? '',
                }),
                empty: false,
            };
        }

        if (
            unitSelectorsIndex.has(selector) &&
            (!exclude || exclude.selector !== selector)
        ) {
            return {
                valid: false,
                tooltip: unitL.selectorAlreadyExists,
                empty: false,
            };
        }

        return { valid: true, tooltip: '', empty: false };
    };

    const validateBoth = (
        name: string,
        selector: string,
        exclude?: ImageConfig
    ): GlobalValidationResult => {
        const nameResult = validateName(name, exclude);
        const selectorResult = validateSelector(selector, exclude);
        const bothEmpty = nameResult.empty && selectorResult.empty;
        const oneEmpty =
            (nameResult.empty || selectorResult.empty) && !bothEmpty;

        return { nameResult, selectorResult, bothEmpty, oneEmpty };
    };

    const applyValidationToElement = (
        element: HTMLInputElement,
        result: UnitValidationResult
    ) => {
        element.classList.toggle('invalid', !result.empty && !result.valid);
        element.ariaLabel = result.tooltip;
    };

    const processBothValidation = (
        nameInput: HTMLInputElement,
        selectorInput: HTMLInputElement,
        result: GlobalValidationResult
    ): boolean => {
        applyValidationToElement(nameInput, result.nameResult);
        applyValidationToElement(selectorInput, result.selectorResult);

        if (result.bothEmpty) {
            plugin.showNotice(unitL.nothingToSave);
            return false;
        }

        if (result.oneEmpty) {
            const field = result.nameResult.empty ? 'name' : 'selector';
            plugin.showNotice(unitL.fillOutField.$format({ field }));
            return false;
        }

        const bothInvalid =
            !result.nameResult.valid && !result.selectorResult.valid;
        const oneInvalid =
            !result.nameResult.valid || !result.selectorResult.valid;

        if (bothInvalid) {
            plugin.showNotice(unitL.bothInvalid);
            return false;
        }

        if (oneInvalid) {
            const field = !result.nameResult.valid ? 'name' : 'selector';
            plugin.showNotice(unitL.oneInvalid.$format({ field }));
            return false;
        }

        return true;
    };

    const processNameValidation = (
        nameInput: HTMLInputElement,
        result: UnitValidationResult
    ): boolean => {
        applyValidationToElement(nameInput, result);
        return result.valid && !result.empty;
    };

    const processSelectorValidation = (
        selectorInput: HTMLInputElement,
        result: UnitValidationResult
    ): boolean => {
        applyValidationToElement(selectorInput, result);
        return result.valid && !result.empty;
    };

    return {
        validateBoth,
        validateName,
        validateSelector,
        processBothValidation,
        processNameValidation,
        processSelectorValidation,
    };
};
