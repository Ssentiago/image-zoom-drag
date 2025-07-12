import { SourceData } from '@/modes/integrated-mode/interactify-unit/types/interfaces';

import { View } from 'obsidian';

import ImageIndexer from '../leaf-index/image-indexer';

export interface LeafIndexData {
    imageIndex: Map<HTMLImageElement | SVGElement, BaseUnitContext>;
    indexer: ImageIndexer | undefined;
}
export interface BaseUnitContext {
    element: SVGElement | HTMLImageElement;
    elementType: 'svg' | 'img';
    origin: 'generated' | 'local' | 'external';
    mode: 'preview' | 'live-preview';
    sourceData: SourceData;
}
export interface LeafContext {
    id: string;
    view: View;
}
