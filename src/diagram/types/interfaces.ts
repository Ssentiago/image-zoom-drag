import { MarkdownPostProcessorContext } from 'obsidian';

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

export interface BaseDiagramContext {
    diagramData: DiagramData;
    diagramElement: HTMLElement;
}

export interface DiagramContext extends BaseDiagramContext {
    sourceData: SourceData;
    size: DiagramSize;
}

export interface FileStats {
    ctime: number;
    mtime: number;
    size: number;
}
