import { moment, requestUrl } from 'obsidian';

import { ContextMenu } from '../context-menu';

export class Export {
    constructor(private readonly contextMenu: ContextMenu) {}

    async export() {
        const element = this.contextMenu.events.diagram.context.diagramElement;

        const svg = element.querySelector('svg');
        const img = element.querySelector('img');

        if (svg) {
            this.exportSVG(svg);
        } else if (img) {
            await this.exportIMG(img);
        } else {
            this.contextMenu.events.diagram.plugin.showNotice(
                "Oops! We couldn't find any elements to export. " +
                    'It seems something is wrong with this diagram?'
            );
        }
    }

    private exportSVG(svg: SVGElement): void {
        const svgData = new XMLSerializer().serializeToString(svg);
        const preface = '<?xml version="1.0" standalone="no"?>\r\n';
        const svgBlob = new Blob([preface, svgData], {
            type: 'image/svg+xml;charset=utf-8',
        });
        this.downloadFile(svgBlob, 'svg');
    }

    private async exportIMG(img: HTMLImageElement): Promise<void> {
        try {
            const response = await requestUrl(img.src);
            const blob = new Blob([response.arrayBuffer], {
                type: 'image/png',
            });

            this.downloadFile(blob, `png`);
        } catch (error: any) {
            this.contextMenu.events.diagram.plugin.showNotice(
                'Error exporting image'
            );
            this.contextMenu.events.diagram.plugin.logger.error(
                `Error exporting image: ${error.message}`
            );
        }
    }

    private downloadFile(blob: Blob, extension: string): void {
        const { diagram } = this.contextMenu.events;
        const filename = `dzg_export_${diagram.plugin.context.view?.file?.basename ?? 'diagram'}}_${moment().format('YYYYMMDDHHmmss')}.${extension}`;
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }
}
