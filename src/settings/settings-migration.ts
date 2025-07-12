import { defaultSettings } from '@/settings/default-settings';

import { MigrateFrom_5_2_0_To_5_3_0 } from './migrations/5.2.0_5.3.0';
import Settings from './settings';
import { DefaultSettings, MigrationResult } from './types/interfaces';

export class SettingsMigration {
    readonly CURRENT_VERSION = '5.3.0';

    constructor(private readonly settings: Settings) {}

    migrate(oldSettings: any): MigrationResult {
        try {
            if (oldSettings?.version === this.CURRENT_VERSION) {
                return {
                    success: true,
                    version: this.CURRENT_VERSION,
                    data: oldSettings,
                };
            }

            let migrated: DefaultSettings;
            const sourceVersion = oldSettings?.version ?? 'unknown';

            if (!oldSettings?.version || oldSettings.version === '5.2.0') {
                const migrator = new MigrateFrom_5_2_0_To_5_3_0(this.settings);
                migrated = migrator.apply(oldSettings);
            } else {
                this.settings.plugin.logger.warn(
                    `Unknown settings version: ${sourceVersion}, using defaults`
                );
                migrated = defaultSettings();
            }

            return {
                success: true,
                version: this.CURRENT_VERSION,
                data: migrated,
            };
        } catch (e: any) {
            return {
                success: false,
                version: this.CURRENT_VERSION,
                errors: [
                    `Migration from ${oldSettings?.version ?? 'unknown'} failed: ${e.message}`,
                ],
            };
        }
    }
}
