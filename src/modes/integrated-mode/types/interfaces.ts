import IntegratedUnit from '@/modes/integrated-mode/integrated-unit/integrated-unit';

export interface StateData {
    units: IntegratedUnit[];
    resizeObserver: ResizeObserver | undefined;
    nativeTouchEventsEnabled: boolean;
}

export interface StateOrphanData {
    units: IntegratedUnit[];
}
