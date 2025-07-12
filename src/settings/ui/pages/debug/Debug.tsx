import { t, tf } from '@/lang';

import { FC, useCallback, useMemo, useState } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';

import { DebugLevel } from '../../../types/interfaces';
import { useSettingsContext } from '../../core/SettingsContext';

/**
 * The debug settings component.
 *
 * Provides settings for debugging, including logging enablement and level
 * selection, log export and copying, and clearing of log storage.
 *
 * @returns The debug settings component.
 */
const Debug: FC = () => {
    const { plugin } = useSettingsContext();
    const [_, setReload] = useState(false);

    const downloadLogs = useCallback(() => {
        const logs = plugin.logger.exportLogs();
        const blob = new Blob([logs], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'interactify-logs.txt';
        link.click();
        URL.revokeObjectURL(url);
    }, [plugin.logger]);

    const storageMessage = tf(t.settings.pages.debug.clearLogsStorage.desc, {
        storage: plugin.logger.getStorageUsage(),
        entries: plugin.logger.getAllLogs().length.toString(),
    });

    return (
        <>
            <ReactObsidianSetting
                name={`${t.settings.pages.debug.reportIssue.name}`}
                multiDesc={(multidesc) => {
                    multidesc.addDescriptions(
                        t.settings.pages.debug.reportIssue.desc
                    );

                    return multidesc;
                }}
                buttons={[
                    (button) => {
                        button.setIcon('bug');
                        button.setTooltip(
                            t.settings.pages.debug.reportIssue.linkButtonTooltip
                        );
                        button.onClick(async () => {
                            const systemInfo = JSON.stringify(
                                plugin.logger.getShortSystemInfo(),
                                null,
                                2
                            );
                            const issueBody = encodeURIComponent(
                                `## Issue Description\n` +
                                    `[Describe your issue here]\n\n` +
                                    `## Steps to Reproduce\n` +
                                    `1. [First step]\n` +
                                    `2. [Second step]\n\n` +
                                    `## System info\n` +
                                    `${systemInfo}\n\n`
                            );
                            const githubUrl =
                                `https://github.com/Ssentiago/interactify/issues/new?` +
                                `title=${encodeURIComponent('[Bug Report] ')}&` +
                                `labels=bug&` +
                                `body=${issueBody}`;
                            window.open(githubUrl, '_blank');
                        });
                        return button;
                    },
                ]}
            />

            <ReactObsidianSetting
                name={t.settings.pages.debug.enableLogging.name}
                desc={t.settings.pages.debug.enableLogging.desc}
                toggles={[
                    (toggle) => {
                        toggle.setValue(plugin.settings.$.debug.enabled);
                        toggle.onChange(async (value) => {
                            plugin.settings.$.debug.enabled = value;
                            await plugin.settings.save();
                        });
                        return toggle;
                    },
                ]}
            />

            <ReactObsidianSetting
                name={t.settings.pages.debug.logLevel.name}
                desc={t.settings.pages.debug.logLevel.desc}
                dropdowns={[
                    (dropdown) => {
                        dropdown.addOptions({
                            none: 'None',
                            error: 'Error',
                            warn: 'Warning',
                            info: 'Info',
                            debug: 'Debug',
                        });
                        dropdown.setValue(plugin.settings.$.debug.level);
                        dropdown.onChange(async (value) => {
                            plugin.settings.$.debug.level = value as DebugLevel;
                            await plugin.settings.save();
                        });

                        return dropdown;
                    },
                ]}
            />

            <ReactObsidianSetting
                name={t.settings.pages.debug.aboutExportedLogs.name}
                multiDesc={(multiDesc) => {
                    multiDesc.addDescriptions(
                        t.settings.pages.debug.aboutExportedLogs.desc
                    );
                    return multiDesc;
                }}
            />

            <ReactObsidianSetting
                name={t.settings.pages.debug.exportLogs.name}
                buttons={[
                    (button) => {
                        button.setIcon('download');
                        button.setTooltip(
                            t.settings.pages.debug.exportLogs
                                .exportButtonTooltip
                        );
                        button.onClick(downloadLogs);
                        return button;
                    },
                ]}
            />
            <ReactObsidianSetting
                name={t.settings.pages.debug.copyLogs.name}
                buttons={[
                    (button) => {
                        button.setIcon('clipboard');
                        button.setTooltip(
                            t.settings.pages.debug.copyLogs.copyButtonTooltip
                        );
                        button.onClick(async () => {
                            const logString = plugin.logger.exportLogs();
                            if (logString.trim() === '') {
                                plugin.showNotice(
                                    t.settings.pages.debug.copyLogs.notice
                                        .logsNotFound
                                );
                                return;
                            }
                            await navigator.clipboard.writeText(logString);
                            plugin.showNotice(
                                t.settings.pages.debug.copyLogs.notice
                                    .successfully
                            );
                        });
                        return button;
                    },
                ]}
            />

            <ReactObsidianSetting
                name={t.settings.pages.debug.clearLogsStorage.name}
                desc={storageMessage}
                buttons={[
                    (button) => {
                        button.setIcon('trash');
                        button.setTooltip(
                            t.settings.pages.debug.clearLogsStorage
                                .clearButtonTooltip
                        );
                        button.onClick(async () => {
                            plugin.logger.clearAllLogs();
                            setReload((prev) => !prev);
                            plugin.showNotice(
                                t.settings.pages.debug.clearLogsStorage.notice
                                    .successfully
                            );
                        });
                        return button;
                    },
                ]}
            />
        </>
    );
};

export default Debug;
