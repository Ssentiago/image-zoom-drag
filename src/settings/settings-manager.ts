import EventEmitter2 from 'eventemitter2';
import { normalizePath } from 'obsidian';

import InteractifyPlugin from '../core/interactify-plugin';
import { UnitConfigs } from '../interactify-unit/types/constants';
import { createEventsWrapper } from './proxy/events-wrapper';
import { createSettingsProxy } from './proxy/settings-proxy';
import { EventsWrapper } from './proxy/types/definitions';
import { SettingsMigration } from './settings-migration';
import {
    ActivationMode,
    DebugLevel,
    DefaultSettings,
    PanelsTriggering,
} from './types/interfaces';

export default class SettingsManager {
    readonly eventBus: EventEmitter2;
    readonly migration: SettingsMigration;

    events!: EventsWrapper<DefaultSettings>;
    data!: DefaultSettings;

    constructor(public readonly plugin: InteractifyPlugin) {
        this.eventBus = new EventEmitter2({
            wildcard: true,
            delimiter: '.',
        });
        this.migration = new SettingsMigration(this);
    }

    get defaultSettings(): DefaultSettings {
        return {
            version: '5.3.0',
            units: {
                interactivity: {
                    markdown: {
                        autoDetect: true,
                        activationMode: ActivationMode.Immediate,
                    },
                    picker: {
                        enabled: false,
                    },
                },
                folding: {
                    foldByDefault: false,
                    autoFoldOnFocusChange: false,
                },
                settingsPagination: {
                    perPage: 5,
                },
                size: {
                    expanded: {
                        width: {
                            value: 100,
                            unit: '%',
                        },
                        height: {
                            value: 100,
                            unit: '%',
                        },
                    },
                    folded: {
                        width: {
                            value: 50,
                            unit: '%',
                        },
                        height: {
                            value: 50,
                            unit: '%',
                        },
                    },
                },
                configs: Object.entries(UnitConfigs).map(([key, value]) => ({
                    name: key,
                    selector: value,
                    on: value !== UnitConfigs.IMG_SVG,
                    panels: {
                        move: {
                            on: true,
                        },
                        zoom: {
                            on: true,
                        },
                        service: {
                            on: true,
                        },
                    },
                })),
            },
            panels: {
                global: {
                    triggering: {
                        mode: PanelsTriggering.ALWAYS,
                        ignoreService: true,
                    },
                },
                local: {
                    preset: '',
                    panels: {
                        service: {
                            on: true,
                            buttons: {
                                hide: true,
                                fullscreen: true,
                            },
                            position: {
                                top: '0px',
                                right: '0px',
                            },
                        },
                        move: {
                            on: true,
                            buttons: {
                                up: true,
                                down: true,
                                left: true,
                                right: true,
                                upLeft: true,
                                upRight: true,
                                downLeft: true,
                                downRight: true,
                            },
                            position: {
                                bottom: '0px',
                                right: '0px',
                            },
                        },
                        zoom: {
                            on: true,
                            buttons: {
                                in: true,
                                out: true,
                                reset: true,
                            },
                            position: {
                                top: '50%',
                                right: '0px',
                            },
                        },
                    },
                },
            },
            debug: {
                enabled: false,
                level: DebugLevel.None,
            },
        } as DefaultSettings;
    }

    async loadSettings(): Promise<void> {
        const userSettings =
            (await this.plugin.loadData()) ?? this.defaultSettings;

        const migrationResult = this.migration.migrate(userSettings);

        let settings: DefaultSettings;
        let needsSave = false;

        if (!migrationResult.success) {
            console.error(
                `Interactify: Error loading settings: ${JSON.stringify(migrationResult.errors)}. Resetting to defaults...`
            );
            settings = this.defaultSettings;
            needsSave = true;
        } else if (!migrationResult.data) {
            console.error(
                'Migration succeeded but data is empty. Using defaults...'
            );
            settings = this.defaultSettings;
            needsSave = true;
        } else {
            settings = migrationResult.data;
            needsSave =
                userSettings?.version !== this.migration.CURRENT_VERSION;
        }

        this.data = createSettingsProxy(this.plugin, { ...settings });
        this.events = createEventsWrapper(settings);

        if (needsSave) {
            await this.saveSettings();
        }
    }

    async saveSettings(): Promise<void> {
        const saveData = {
            ...this.data,
        };
        await this.plugin.saveData(saveData);
    }

    async resetSettings(): Promise<void> {
        const pluginPath = this.plugin.manifest.dir;

        if (!pluginPath) {
            throw new Error('Interactify: `No plugin dir found`');
        }

        const configPath = normalizePath(`${pluginPath}/data.json`);
        const existsPath =
            await this.plugin.app.vault.adapter.exists(configPath);
        existsPath && (await this.plugin.app.vault.adapter.remove(configPath));
        await this.loadSettings();
    }
}
