export interface DiagramValidationResult {
    empty: boolean;
    valid: boolean;
    tooltip: string;
}

export interface GlobalValidationResult {
    nameResult: DiagramValidationResult;
    selectorResult: DiagramValidationResult;
    bothEmpty: boolean;
    oneEmpty: boolean;
}
