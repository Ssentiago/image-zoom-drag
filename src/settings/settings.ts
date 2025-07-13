import { defaultSettings } from '@/settings/default-settings';

import EventEmitter2 from 'eventemitter2';
import { normalizePath } from 'obsidian';

import InteractifyPlugin from '../core/interactify-plugin';
import { createEventsWrapper } from './proxy/events-wrapper';
import { createSettingsProxy } from './proxy/settings-proxy';
import { EventsWrapper } from './proxy/types/definitions';
import { SettingsMigration } from './settings-migration';
import { DefaultSettings } from './types/interfaces';

export default class Settings {
    readonly emitter: EventEmitter2;
    private data!: DefaultSettings;
    private readonly migration: SettingsMigration;

    $$!: EventsWrapper<DefaultSettings>;

    constructor(public readonly plugin: InteractifyPlugin) {
        this.emitter = new EventEmitter2({
            wildcard: true,
            delimiter: '.',
        });
        this.migration = new SettingsMigration(this);
    }

    get $() {
        return this.data;
    }

    async load(): Promise<void> {
        const userSettings =
            (await this.plugin.loadData()) ?? defaultSettings();

        const migrationResult = this.migration.migrate(userSettings);

        let settings: DefaultSettings;
        let needsSave = false;

        if (!migrationResult.success) {
            console.error(
                `Interactify: Error loading settings: ${JSON.stringify(migrationResult.errors)}. Resetting to defaults...`
            );
            settings = defaultSettings();
            needsSave = true;
        } else if (!migrationResult.data) {
            console.error(
                'Migration succeeded but data is empty. Using defaults...'
            );
            settings = defaultSettings();
            needsSave = true;
        } else {
            settings = migrationResult.data;
            needsSave =
                userSettings?.version !== this.migration.CURRENT_VERSION;
        }

        this.data = createSettingsProxy(this, { ...settings }, []);
        this.$$ = createEventsWrapper(settings);

        if (needsSave) {
            await this.save();
        }
    }

    async save(): Promise<void> {
        await this.plugin.saveData(this.$);
    }

    async reset(): Promise<void> {
        const pluginPath = this.plugin.manifest.dir;

        if (!pluginPath) {
            throw new Error('Interactify: `No plugin dir found`');
        }

        const configPath = normalizePath(`${pluginPath}/data.json`);
        const existsPath =
            await this.plugin.app.vault.adapter.exists(configPath);
        existsPath && (await this.plugin.app.vault.adapter.remove(configPath));
        await this.load();
    }
}
