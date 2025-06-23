import { Component, moment, requestUrl } from 'obsidian';

import { ContextMenu } from '../context-menu';

export class Export extends Component {
    constructor(private readonly contextMenu: ContextMenu) {
        super();
    }

    async export() {
        const element = this.contextMenu.events.unit.context.element;

        if (element instanceof SVGElement) {
            this.exportSVG(element);
        } else {
            await this.exportIMG(element);
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

            this.downloadFile(blob, '.png');
        } catch (error: any) {
            this.contextMenu.events.unit.plugin.showNotice(
                'Error exporting image'
            );
            this.contextMenu.events.unit.plugin.logger.error(
                `Error exporting image: ${error.message}`
            );
        }
    }

    private downloadFile(blob: Blob, extension: string): void {
        const { unit } = this.contextMenu.events;
        const filename = `export_${unit.plugin.context.view?.file?.basename ?? 'unit'}}_${moment().format('YYYYMMDDHHmmss')}.${extension}`;
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
