import InteractifyUnit from '@/modes/integrated-mode/interactify-unit/interactify-unit';

export interface StateData {
    units: InteractifyUnit[];
    resizeObserver: ResizeObserver | undefined;
}

export interface StateOrphanData {
    units: InteractifyUnit[];
}
