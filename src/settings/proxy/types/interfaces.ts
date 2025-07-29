export interface EventPath {
    $path: string;
    $all: string;
    $deep: string;
    $children: string;

    toString(): string;
    valueOf(): string;
}
