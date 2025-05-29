import { Diagram } from '../diagram';
import { MarkdownPreviewAdapter } from './adapters/markdown-preview-adapter';
import { MarkdownLivePreviewAdapter } from './adapters/markdown-live-preview-adapter';
import { BaseAdapter } from './base-adapter';

export class AdapterFactory {
    static getSuitableAdapter(diagram: Diagram): BaseAdapter | undefined {
        if (diagram.plugin.isInPreviewMode) {
            return new MarkdownPreviewAdapter(diagram);
        } else if (diagram.plugin.isInLivePreviewMode) {
            return new MarkdownLivePreviewAdapter(diagram);
        }
        throw new Error('Diagram Zoom Drag: "No suitable adapter found!"');
    }
}
