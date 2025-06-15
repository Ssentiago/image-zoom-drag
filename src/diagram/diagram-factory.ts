import DiagramZoomDragPlugin from '../core/diagram-zoom-drag-plugin';
import Diagram from './diagram';
import {
    BaseDiagramContext,
    DiagramContext,
    DiagramSize,
    FileStats,
    SourceData,
} from './types/interfaces';

export default class DiagramFactory {
    static createDiagram(
        plugin: DiagramZoomDragPlugin,
        diagramDescriptor: BaseDiagramContext,
        sourceData: SourceData,
        size: DiagramSize,
        fileStats: FileStats,
        container: HTMLElement
    ): Diagram {
        const extendedDiagramDescriptor = {
            ...diagramDescriptor,
            sourceData,
            size,
        } as DiagramContext;
        plugin.logger.debug('Creating diagram...');
        const diagram = new Diagram(
            plugin,
            container,
            extendedDiagramDescriptor,
            fileStats
        );
        diagram.initialize();
        plugin.logger.debug(
            'Diagram was created and initialized successfully.'
        );
        return diagram;
    }
}
