import { Component, requestUrl } from 'obsidian';

import { ContextMenu } from '../context-menu';

export class CopyDiagram extends Component {
    constructor(private readonly contextMenu: ContextMenu) {
        super();
    }

    async copy() {
        const { plugin } = this.contextMenu.events.diagram;
        const element = this.contextMenu.events.diagram.context.element;

        try {
            if (element instanceof SVGElement) {
                await this.copySvg(element);
            } else {
                await this.copyImg(element);
            }

            plugin.showNotice('Copied');
        } catch (error) {
            plugin.showNotice('Copy failed');
            console.error('Copy operation failed:', error);
        }
    }
    private async copyImg(img: HTMLImageElement): Promise<void> {
        const fetchImg = async (): Promise<Blob> => {
            const response = await requestUrl(img.src);
            return new Blob([response.arrayBuffer], { type: 'image/png' });
        };

        const drawLocalImage = async (): Promise<Blob> => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            return new Promise((resolve) => {
                canvas.toBlob((blob) => resolve(blob!), 'image/png');
            });
        };

        try {
            let blob: Blob;
            try {
                blob = await fetchImg();
            } catch {
                blob = await drawLocalImage();
            }

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
            ]);
        } catch (error: any) {
            this.contextMenu.events.diagram.plugin.showNotice(
                'Failed to copy image'
            );
            this.contextMenu.events.diagram.plugin.logger.debug(
                `Error copy image: ${error.message}`
            );
        }
    }

    private async copySvg(svg: SVGElement): Promise<void> {
        try {
            svg.focus();
            const svgString = new XMLSerializer().serializeToString(svg);
            await navigator.clipboard.writeText(svgString);
        } catch (error) {
            console.error('Failed to copy SVG:', error);
        }
    }
}
