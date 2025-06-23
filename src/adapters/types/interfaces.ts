export interface WidgetLocalEmbedImageData {
    href: string;
    start: number;
    end: number;
    title: string;
}

export interface WidgetEmbedInternalImageData {
    start: number;
    end: number;
    title: string;
    url: string;
}

export interface WidgetGeneratedImageData {
    code: string;
    lineStart: number;
    lineEnd: number;
}

export interface HTMLElementWithCMView extends HTMLElement {
    cmView?: {
        deco?: {
            widget:
                | WidgetLocalEmbedImageData
                | WidgetEmbedInternalImageData
                | WidgetGeneratedImageData;
        };
        isWidget: boolean;
    };
}
