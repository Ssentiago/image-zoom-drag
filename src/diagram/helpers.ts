import { Diagrams } from '../settings/types/interfaces';
import { DiagramSize } from './types/interfaces';

export function updateDiagramSize(
    container: HTMLElement,
    originalSize: DiagramSize,
    settingsSizeData: Diagrams['size'],
    inLivePreviewMode: boolean
): void {
    const isFolded = container.dataset.folded === 'true';

    const setting = isFolded
        ? settingsSizeData.folded
        : settingsSizeData.expanded;
    const heightValue = setting.height.value;
    const widthValue = setting.width.value;
    const heightInPx =
        setting.height.unit === '%'
            ? (heightValue / 100) * originalSize.height
            : heightValue;
    const widthInPx =
        setting.width.unit === '%'
            ? (widthValue / 100) * originalSize.width
            : widthValue;

    container.style.height = `${heightInPx}px`;
    container.style.width = `${widthInPx}px`;

    if (inLivePreviewMode) {
        const parent = container.closest('.live-preview-parent') as HTMLElement;
        parent.style.setProperty('height', `${heightInPx}px`, 'important');
        parent.style.setProperty('width', `${widthInPx}px`, 'important');
    }
}
