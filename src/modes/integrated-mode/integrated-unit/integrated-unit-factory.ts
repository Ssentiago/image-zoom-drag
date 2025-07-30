import IzdPlugin from '../../../core/izd-plugin';
import IntegratedUnit from './integrated-unit';
import { UnitContext, FileStats } from './types/interfaces';

export default class IntegratedUnitFactory {
    static async createUnit(
        plugin: IzdPlugin,
        context: UnitContext,
        fileStats: FileStats
    ): Promise<IntegratedUnit> {
        plugin.logger.debug('Creating unit...');

        const unit = new IntegratedUnit(plugin, context, fileStats);
        await unit.setup();

        plugin.logger.debug('Unit was created and initialized successfully.');

        return unit;
    }
}
