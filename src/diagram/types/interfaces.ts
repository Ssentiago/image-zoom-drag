import { MarkdownPostProcessorContext } from 'obsidian';

import { DiagramAdapters } from '../../adapters/types/constants';
import { HTMLElementWithCMView } from '../../adapters/types/interfaces';
import { DiagramData } from '../../settings/types/interfaces';

export interface SourceData {
    source: string;
    lineStart: number;
    lineEnd: number;
}

export interface DiagramSize {
    width: number;
    height: number;
}

export interface ContextData {
    contextEl: HTMLElement;
    context: MarkdownPostProcessorContext;
}

export interface DiagramContext {
    adapter: DiagramAdapters;
    sourceData: SourceData;
    size: DiagramSize;
    originalParent: HTMLElement;
    container: HTMLElement;
    content: HTMLElement;
    options: DiagramData;
    element: HTMLImageElement | SVGElement;
    livePreviewWidget?: HTMLElementWithCMView;
}

export interface FileStats {
    ctime: number;
    mtime: number;
    size: number;
}
