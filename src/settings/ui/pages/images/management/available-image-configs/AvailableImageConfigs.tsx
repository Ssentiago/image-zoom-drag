import { t } from '@/lang';

import React, { FC, useEffect, useMemo, useState } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';
import { ArrowLeft, ArrowRight, RotateCcw, RotateCw } from 'lucide-react';

import { LocaleString } from '../../../../../../lang/proxy/types/definitions';
import { useSettingsContext } from '../../../../core/SettingsContext';
import { useUnitsHistoryContext } from '../context/HistoryContext';
import { useUnitsManagerContext } from '../context/UnitsManagerContext';
import {
    ButtonContainer,
    PaginationButton,
    PaginationControls,
    RedoButton,
    UndoButton,
} from './AvailableImageConfigs.styled';
import { ImageConfigItem } from './ImageConfigItem';
import { usePagination } from './hooks/usePagination';
import { ImageConfigOptionsModal } from './modals/ImageConfigOptionsModal';
import { ModeState } from './types/interfaces';

const AvailableImageConfigs: FC = () => {
    const { plugin } = useSettingsContext();

    const paginationTitle: LocaleString = useMemo(
        () =>
            t.settings.pages.images.management.availableImageConfigs.pagination
                .page,
        [plugin]
    );

    debugger;

    const [unitsPerPage, setUnitsPerPage] = useState(
        plugin.settings.data.units.settingsPagination.perPage
    );
    const { units } = useUnitsManagerContext();
    const [modeState, setModeState] = useState<ModeState>({
        mode: 'none',
        index: -1,
    });

    const { navigateToPage, totalPages, pageStartIndex, pageEndIndex, page } =
        usePagination({
            itemsPerPage: unitsPerPage,
            totalItems: units.length,
        });

    const {
        updateUndoStack,
        undo,
        canUndo,
        canRedo,
        getRedoLabel,
        redo,
        getUndoLabel,
    } = useUnitsHistoryContext();

    useEffect(() => {
        const handler = async () => {
            setUnitsPerPage(
                plugin.settings.data.units.settingsPagination.perPage
            );
        };

        plugin.settings.eventBus.on(
            plugin.settings.events.units.settingsPagination.perPage.$path,
            handler
        );
        return (): void => {
            plugin.settings.eventBus.off(
                plugin.settings.events.units.settingsPagination.perPage.$path,
                handler
            );
        };
    }, [plugin]);

    const visibleDUnits = useMemo(() => {
        return units.slice(pageStartIndex, pageEndIndex);
    }, [units, pageStartIndex, pageEndIndex]);

    const getPageChangeButtonLabel = (type: 'previous' | 'next') => {
        const canChange = type === 'next' ? page < totalPages : page > 1;
        const buttons =
            t.settings.pages.images.management.availableImageConfigs.pagination
                .buttons;

        if (modeState.mode === 'edit' && canChange) {
            return buttons.editingBlocked;
        }

        const buttonConfig =
            type === 'previous' ? buttons.previous : buttons.next;
        return canChange ? buttonConfig.enabled : buttonConfig.disabled;
    };

    return (
        <>
            <ReactObsidianSetting
                name={
                    t.settings.pages.images.management.availableImageConfigs
                        .header
                }
                setHeading
            />
            <ReactObsidianSetting
                name={
                    t.settings.pages.images.management.availableImageConfigs
                        .perPageSlider.name
                }
                setDisabled={modeState.mode === 'edit'}
                sliders={[
                    (slider) => {
                        slider.setValue(
                            plugin.settings.data.units.settingsPagination
                                .perPage
                        );
                        slider.setLimits(1, 50, 1);
                        slider.setDynamicTooltip();
                        slider.onChange(async (value) => {
                            plugin.settings.data.units.settingsPagination.perPage =
                                value;
                            await plugin.settings.saveSettings();
                        });
                        return slider;
                    },
                ]}
            />
            <ButtonContainer>
                <UndoButton
                    onClick={undo}
                    disabled={!canUndo}
                    aria-label={getUndoLabel()}
                >
                    <RotateCcw size={'20px'} />
                </UndoButton>

                <PaginationControls>
                    <PaginationButton
                        onClick={() => navigateToPage(-1)}
                        disabled={page === 1 || modeState.mode === 'edit'}
                        aria-label={getPageChangeButtonLabel('previous')}
                    >
                        <ArrowLeft size={'20px'} />
                    </PaginationButton>
                    {paginationTitle.$format({
                        current: page.toString(),
                        total: totalPages.toString(),
                        count: units.length.toString(),
                    })}
                    <PaginationButton
                        onClick={() => navigateToPage(1)}
                        disabled={
                            page === totalPages || modeState.mode === 'edit'
                        }
                        aria-label={getPageChangeButtonLabel('next')}
                    >
                        <ArrowRight size={'20px'} />
                    </PaginationButton>
                </PaginationControls>

                <RedoButton
                    disabled={!canRedo}
                    onClick={redo}
                    aria-label={getRedoLabel()}
                >
                    <RotateCw size={'20px'} />
                </RedoButton>
            </ButtonContainer>

            {visibleDUnits.map((unit, index) => (
                <ImageConfigItem
                    key={`${unit.name}-${unit.selector}`}
                    unit={unit}
                    index={pageStartIndex + index}
                    modeState={modeState}
                    setModeState={setModeState}
                />
            ))}

            {modeState.mode === 'options' && modeState.index !== -1 && (
                <ImageConfigOptionsModal
                    unitIndex={modeState.index}
                    onChanges={updateUndoStack}
                    onClose={() => {
                        setModeState({
                            mode: 'none',
                            index: -1,
                        });
                    }}
                />
            )}
        </>
    );
};

export default AvailableImageConfigs;
