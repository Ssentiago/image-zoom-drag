import { EventPath } from './interfaces';

export type EventsWrapper<T> = {
    [K in keyof T]: T[K] extends object ? EventsWrapper<T[K]> : EventPath;
} & {
    $path: string;
    $all: string;
    $deep: string;
    $children: string;
};
