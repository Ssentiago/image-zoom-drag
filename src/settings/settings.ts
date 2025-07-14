import { defaultSettings } from '@/settings/default-settings';

import EventEmitter2 from 'eventemitter2';
import { Component, normalizePath } from 'obsidian';

import InteractifyPlugin from '../core/interactify-plugin';
import { createEventsWrapper } from './proxy/events-wrapper';
import { createSettingsProxy } from './proxy/settings-proxy';
import { EventsWrapper } from './proxy/types/definitions';
import { SettingsMigration } from './settings-migration';
import { DefaultSettings } from './types/interfaces';

export default class Settings extends Component {
    dirty = false;
    private data!: DefaultSettings;

    readonly emitter: EventEmitter2;
    $$!: EventsWrapper<DefaultSettings>;

    private readonly migration: SettingsMigration;

    private savePromise?: Promise<void> | undefined;
    private saveTimeout?: NodeJS.Timeout | undefined;
    private saveResolve?: (() => void) | undefined;

    constructor(public readonly plugin: InteractifyPlugin) {
        super();
        this.emitter = new EventEmitter2({
            wildcard: true,
            delimiter: '.',
        });
        this.migration = new SettingsMigration(this);
        this.setupEvents();
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

        // reactive settings: `$.units.*** = ...` -> `emit('settings.units.***', (payload))`
        this.data = createSettingsProxy(this, { ...settings }, []);

        // to get typed settings event paths: `$$.units.$path` -> `settings.units`
        this.$$ = createEventsWrapper(settings);

        if (needsSave) {
            await this.save();
        }
    }

    async save(): Promise<void> {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.savePromise ??= new Promise((resolve) => {
            this.saveResolve = resolve;
        });

        this.saveTimeout = setTimeout(async () => {
            try {
                await this.plugin.saveData(this.$);
                this.dirty = false;
            } catch (err: any) {
                this.plugin.logger.error(
                    `Settings save failed: ${err.message}`
                );
            } finally {
                this.savePromise = undefined;
                this.saveResolve?.();
                this.saveResolve = undefined;
                this.saveTimeout = undefined;
            }
        }, 500);

        return this.savePromise;
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

    setupEvents() {
        this.emitter.on('**', () => (this.dirty = true));
    }

    async onunload() {
        super.onunload();
        this.emitter.removeAllListeners();

        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = undefined;
        }

        if (this.dirty && this.savePromise) {
            await this.savePromise;
        } else if (this.dirty) {
            await this.plugin.saveData(this.$);
            this.dirty = false;
        }

        this.savePromise = undefined;
    }
}
