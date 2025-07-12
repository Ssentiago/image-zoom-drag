import InteractifyPlugin from '../../../core/interactify-plugin';
import InteractifyUnit from './interactify-unit';
import { UnitContext, FileStats } from './types/interfaces';

export default class InteractifyUnitFactory {
    static async createUnit(
        plugin: InteractifyPlugin,
        context: UnitContext,
        fileStats: FileStats
    ): Promise<InteractifyUnit> {
        plugin.logger.debug('Creating unit...');

        const unit = new InteractifyUnit(plugin, context, fileStats);
        await unit.setup();

        plugin.logger.debug('Unit was created and initialized successfully.');

        return unit;
    }
}
