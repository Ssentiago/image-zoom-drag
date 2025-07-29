export interface UnitInfo {
    name: string;
    selector: string;
    enabled: boolean;
    dimensions: {
        width: number;
        height: number;
    };
    sourceLocation: {
        lineStart: number;
        lineEnd: number;
        linesCount: number;
    };
    panels: Array<{
        name: string;
        enabled: boolean;
    }>;
    elementType: string;
}
