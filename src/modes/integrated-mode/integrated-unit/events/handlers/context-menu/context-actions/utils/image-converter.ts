import { requestUrl } from 'obsidian';

export default class ImageConverter {
    async imgToBlob(
        img: HTMLImageElement | SVGElement,
        format: 'png' | 'jpg' | 'svg'
    ): Promise<Blob> {
        let blob: Blob;

        if (img instanceof SVGElement) {
            if (format === 'svg') {
                blob = this.svgToBlob(img);
            } else {
                blob = await this.drawSVGAsRaster(
                    img,
                    format === 'png' ? 'png' : 'jpeg'
                );
            }
        } else {
            const normalizedFormat = format === 'png' ? 'png' : 'jpeg';
            try {
                blob = await this.fetchImg(img, normalizedFormat);
            } catch {
                blob = await this.drawLocalImage(img, normalizedFormat);
            }
        }

        return blob;
    }

    private async drawSVGAsRaster(
        svg: SVGElement,
        format: 'png' | 'jpeg'
    ): Promise<Blob> {
        const svgData = this.svgToCode(svg);
        const img = new Image();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        const dataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
        img.src = dataURL;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        canvas.width = img.naturalWidth || 800; // fallback size
        canvas.height = img.naturalHeight || 600;
        ctx.drawImage(img, 0, 0);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), `image/${format}`);
        });
    }

    svgToCode(element: SVGElement): string {
        if (element instanceof SVGElement) {
            return new XMLSerializer().serializeToString(element);
        }
        return '';
    }

    svgToBlob(element: SVGElement): Blob {
        const svgData = this.svgToCode(element);
        const preface = '<?xml version="1.0" standalone="no"?>\r\n';
        return new Blob([preface, svgData], {
            type: 'image/svg+xml;charset=utf-8',
        });
    }

    async fetchImg(
        img: HTMLImageElement,
        format: 'png' | 'jpeg'
    ): Promise<Blob> {
        const response = await requestUrl(img.src);
        return new Blob([response.arrayBuffer], { type: `image/${format}` });
    }

    async drawLocalImage(
        img: HTMLImageElement,
        format: 'png' | 'jpeg'
    ): Promise<Blob> {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), `image/${format}`);
        });
    }
}
