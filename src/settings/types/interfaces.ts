import { DimensionUnit } from './definitions';

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
export interface DragItem {
    panelName: string;
    offsetX: number;
    offsetY: number;
}
export type EdgePosition = 'top' | 'bottom' | 'left' | 'right';

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

export interface DimensionSetting {
    width: {
        value: number;
        unit: DimensionUnit;
    };
    height: {
        value: number;
        unit: DimensionUnit;
    };
}

export enum PanelsTriggering {
    ALWAYS = 'always',
    HOVER = 'hover',
    FOCUS = 'focus',
}

export interface Position {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
}

export interface Panels {
    global: {
        triggering: {
            mode: PanelsTriggering;
            ignoreService: boolean;
        };
    };
    local: {
        panels: {
            service: {
                on: boolean;
                buttons: {
                    hide: boolean;
                    fullscreen: boolean;
                };
                position: Position;
            };
            move: {
                on: boolean;
                buttons: {
                    up: boolean;
                    down: boolean;
                    left: boolean;
                    right: boolean;
                    upLeft: boolean;
                    upRight: boolean;
                    downLeft: boolean;
                    downRight: boolean;
                };
                position: Position;
            };
            zoom: {
                on: boolean;
                buttons: {
                    in: boolean;
                    out: boolean;
                    reset: boolean;
                };
                position: Position;
            };
        };
        preset: 'mobile' | 'desktop' | 'presentation' | '';
    };
}

export enum ActivationMode {
    Immediate = 'immediate',
    Lazy = 'lazy',
}

export interface Interactive {
    markdown: {
        autoDetect: boolean;
        activationMode: ActivationMode;
    };
    picker: {
        enabled: boolean;
    };
}

export interface Diagrams {
    interactive: Interactive;
    settingsPagination: {
        perPage: number;
    };
    folding: {
        foldByDefault: boolean;
        autoFoldOnFocusChange: boolean;
    };
    size: {
        expanded: DimensionSetting;
        folded: DimensionSetting;
    };
    supported_diagrams: DiagramData[];
}

export enum DebugLevel {
    None = 'none',
    Debug = 'debug',
    Info = 'info',
    Warn = 'warn',
    Error = 'error',
}

interface Debug {
    enabled: boolean;
    level: DebugLevel;
}

export interface DefaultSettings {
    version: string;
    panels: Panels;
    diagrams: Diagrams;
    debug: Debug;
}

export interface MigrationResult {
    success: boolean;
    version: string;
    data?: DefaultSettings;
    errors?: string[];
}

export interface EventPath {
    $path: string;

    toString(): string;

    valueOf(): string;
}

export type EventsWrapper<T> = {
    [K in keyof T]: T[K] extends object ? EventsWrapper<T[K]> : EventPath;
} & {
    $path: string;
    $all: string;
    $deep: string;
    $children: string;
};

export interface SettingsEventPayload {
    eventName: string;
    oldValue: any;
    newValue: any;
}
