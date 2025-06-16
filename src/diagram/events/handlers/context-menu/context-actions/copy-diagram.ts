import { requestUrl } from 'obsidian';

import { ContextMenu } from '../context-menu';

export class CopyDiagram {
    constructor(private readonly contextMenu: ContextMenu) {}

    async copy() {
        const { plugin } = this.contextMenu.events.diagram;
        const element = this.contextMenu.events.diagram.context.diagramElement;

        const svg = element.querySelector('svg');
        const img = element.querySelector('img');

        try {
            if (svg) {
                await this.copySvg(svg);
            } else if (img) {
                await this.copyImg(img);
            } else {
                console.error(
                    'Neither SVG nor IMG element found in the container'
                );
                return;
            }

            plugin.showNotice('Copied');
        } catch (error) {
            plugin.showNotice('Copy failed');
            console.error('Copy operation failed:', error);
        }
    }
    private async copyImg(img: HTMLImageElement): Promise<void> {
        try {
            const response = await requestUrl(img.src);
            const blob = new Blob([response.arrayBuffer], {
                type: 'image/png',
            });

            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob,
                }),
            ]);
        } catch (error: any) {
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
