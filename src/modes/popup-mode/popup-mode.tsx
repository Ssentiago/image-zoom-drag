import InteractifyPlugin from '@/core/interactify-plugin';
import PopupRoot from '@/modes/popup-mode/ui/PopupRoot';
import { isThisSvgIcon } from '@/utils/dom-utils';

import { Component, MarkdownRenderer, MarkdownView } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';

export default class PopupMode extends Component {
    popupDiv: HTMLDivElement | null = null;
    popupRoot: Root | null = null;

    constructor(readonly plugin: InteractifyPlugin) {
        super();
    }

    initialize(): void {
        this.load();

        this.plugin.app.workspace.on('layout-change', () => {
            const view =
                this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
            if (!view) {
                return;
            }
            this.addPopupButton(view);
        });
    }

    addPopupButton(view: MarkdownView): void {
        const hasButton = view.actionsEl.querySelector(
            '.interactify-popup-button'
        );

        if (hasButton) {
            return;
        }

        const button = view.addAction(
            'layout-grid',
            'Open view image gallery in popup window',
            this.showPopupForViewImages.bind(this)
        );

        button.addClass('interactify-popup-button');

        this.register(() => {
            button.remove();
        });
    }

    async getAllImagesForPopup(
        view: MarkdownView
    ): Promise<Array<HTMLImageElement | SVGElement>> {
        const component = new Component();
        component.load();

        const el = document.createElement('div');
        el.style.visibility = 'hidden';
        document.body.appendChild(el);

        const content = await this.plugin.app.vault.cachedRead(view.file!);
        await MarkdownRenderer.render(
            this.plugin.app,
            content,
            el,
            view.file!.path,
            component
        );

        await new Promise((resolve) => requestAnimationFrame(resolve));

        const images = Array.from(el.querySelectorAll('img')).filter(
            (img) => !isThisSvgIcon(img)
        ) as Array<HTMLImageElement | SVGElement>;

        el.remove();
        component.unload();

        return images;
    }

    async showPopupForViewImages(): Promise<void> {
        const view =
            this.plugin.app.workspace.getActiveViewOfType(MarkdownView)!;

        const images = await this.getAllImagesForPopup(view);
        if (images.length === 0) {
            this.plugin.showNotice('No images found in the current view.');
            return;
        }
        await this.showPopup(images);
    }

    async showPopupForImage(
        image: HTMLImageElement | SVGElement
    ): Promise<void> {
        await this.showPopup(image);
    }

    async showPopup(
        image:
            | HTMLImageElement
            | SVGElement
            | Array<HTMLImageElement | SVGElement>
    ): Promise<void> {
        const images = Array.isArray(image) ? image : [image];

        this.popupDiv ??= document.body.createDiv();
        if (!this.popupRoot) {
            this.popupRoot = createRoot(this.popupDiv);
            this.popupRoot.render(
                <PopupRoot
                    popupMode={this}
                    initialImages={images}
                    onClose={() => this.closePopup()}
                />
            );
        } else {
            this.plugin.emitter.emit('image.popup.show', image);
        }
    }

    closePopup(): void {
        this.popupRoot?.unmount();
        this.popupRoot = null;
        this.popupDiv?.remove();
        this.popupDiv = null;
    }

    onunload(): void {
        super.onunload();
        this.closePopup();
    }
}
