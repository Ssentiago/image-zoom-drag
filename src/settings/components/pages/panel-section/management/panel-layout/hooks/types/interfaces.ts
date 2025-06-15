import { Panels } from '../../../../../../../types/interfaces';

export interface useDragDropProps {
    diagramPreviewRef: React.RefObject<HTMLDivElement | null>;
    panels: Panels['local']['panels'];
}
