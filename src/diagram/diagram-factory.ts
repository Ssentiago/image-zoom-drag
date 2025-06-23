import DiagramZoomDragPlugin from '../core/diagram-zoom-drag-plugin';
import InteractiveElement from './interactiveElement';
import { DiagramContext, FileStats } from './types/interfaces';

export default class DiagramFactory {
    static createDiagram(
        plugin: DiagramZoomDragPlugin,
        context: DiagramContext,
        fileStats: FileStats
    ): InteractiveElement {
        plugin.logger.debug('Creating diagram...');
        const diagram = new InteractiveElement(plugin, context, fileStats);
        plugin.logger.debug(
            'Diagram was created and initialized successfully.'
        );
        return diagram;
    }
}
