import { Diagrams } from '../settings/types/interfaces';
import { DiagramContext, DiagramSize } from './types/interfaces';

export function updateDiagramSize(
    context: DiagramContext,
    originalSize: DiagramSize,
    settingsSizeData: Diagrams['size'],
    inLivePreviewMode: boolean
): void {
    const isFolded = context.container.dataset.folded === 'true';

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

    context.container.style.height = `${heightInPx}px`;
    context.container.style.width = `${widthInPx}px`;

    if (inLivePreviewMode) {
        const parent = context.livePreviewWidget!;
        parent.style.setProperty('height', `${heightInPx}px`, 'important');
        parent.style.setProperty('width', `${widthInPx}px`, 'important');
    }
}
