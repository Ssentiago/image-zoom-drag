export interface UnitValidationResult {
    empty: boolean;
    valid: boolean;
    tooltip: string;
}

export interface GlobalValidationResult {
    nameResult: UnitValidationResult;
    selectorResult: UnitValidationResult;
    bothEmpty: boolean;
    oneEmpty: boolean;
}
