import InteractifyUnit from '@/modes/integrated-mode/interactify-unit/interactify-unit';

export interface StateData {
    units: InteractifyUnit[];
    resizeObserver: ResizeObserver | undefined;
    nativeTouchEventsEnabled: boolean;
}

export interface StateOrphanData {
    units: InteractifyUnit[];
}
