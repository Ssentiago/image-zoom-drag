import { MarkdownPostProcessorContext } from 'obsidian';

import { InteractifyAdapters } from '../../adapters/types/constants';
import { HTMLElementWithCMView } from '../../adapters/types/interfaces';
import { ImageConfig } from '../../settings/types/interfaces';

export interface SourceData {
    source: string;
    lineStart: number;
    lineEnd: number;
}

export interface UnitSize {
    width: number;
    height: number;
}

export interface PreviewContextData {
    contextEl: HTMLElement;
    context: MarkdownPostProcessorContext;
}

export interface UnitContext {
    adapter: InteractifyAdapters;
    sourceData: SourceData;
    size: UnitSize;
    originalParent: HTMLElement;
    container: HTMLElement;
    content: HTMLElement;
    options: ImageConfig;
    element: HTMLImageElement | SVGElement;
    livePreviewWidget?: HTMLElementWithCMView;
}

export interface FileStats {
    ctime: number;
    mtime: number;
    size: number;
}
