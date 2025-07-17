import { Panels } from '@/settings/types/interfaces';

export interface useDragDropProps {
    unitPreviewRef: React.RefObject<HTMLDivElement | null>;
    panels: Panels['local']['panels'];
}
