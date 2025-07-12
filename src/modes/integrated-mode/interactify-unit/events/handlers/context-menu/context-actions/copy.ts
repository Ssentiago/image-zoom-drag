import { Component, Menu, requestUrl } from 'obsidian';

import { ContextMenu } from '../context-menu';
import ImageConverter from './utils/image-converter';

export class Copy extends Component {
    imageConverter: ImageConverter;
    constructor(private readonly contextMenu: ContextMenu) {
        super();

        this.imageConverter = new ImageConverter();
    }

    async copyAsPNG(img: HTMLImageElement | SVGElement) {
        try {
            const blob = await this.imageConverter.imgToBlob(img, 'png');
            await this.writeToBuffer(blob, 'png');
        } catch (error) {
            this.contextMenu.events.unit.plugin.logger.error(
                'Error copying as PNG:',
                error
            );
            this.contextMenu.events.unit.plugin.showNotice(
                'Failed to copy image as PNG. Please try again.'
            );
        }
    }

    async copyAsPlain(element: SVGElement) {
        const code = this.imageConverter.svgToCode(element);
        const blob = new Blob([code], { type: 'text/plain' });
        await this.writeToBuffer(blob, 'plain');
    }

    async copyAsSource() {
        const source = this.contextMenu.events.unit.context.sourceData.source;
        const blob = new Blob([source], { type: 'text/plain' });
        await this.writeToBuffer(blob, 'plain');
    }

    async writeToBuffer(blob: Blob, format: 'png' | 'plain') {
        const mimeTypes = {
            png: 'image/png',
            plain: 'text/plain',
        };

        const mimeType = mimeTypes[format];

        await navigator.clipboard.write([
            new ClipboardItem({
                [mimeType]: blob,
            }),
        ]);
    }
}
