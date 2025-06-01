export interface DiagramData {
    name: string;
    selector: string;
    on: boolean;
    panels: {
        [key: string]: {
            on: boolean;
        };
    };
}

export interface PanelPosition {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
}

export interface PanelConfig {
    enabled: boolean;
    position: PanelPosition;
}

export interface PanelsConfig {
    service: PanelConfig;
    move: PanelConfig;
    zoom: PanelConfig;
}

export type DimensionUnit = 'px' | '%';

export interface DimensionSetting {
    width: string;
    widthUnit: DimensionUnit;
    height: string;
    heightUnit: DimensionUnit;
}

export interface DefaultSettings {
    supported_diagrams: DiagramData[];
    panelsConfig: PanelsConfig;
    diagramsPerPage: number;
    foldByDefault: boolean;
    preserveDiagramOriginalSize: boolean;
    automaticFoldingOnFocusChange: boolean;
    hideOnMouseOutDiagram: boolean;
    diagramExpanded: DimensionSetting;
    diagramFolded: DimensionSetting;
    addHidingButton: boolean;
}
