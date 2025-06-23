import React, { FC, useEffect, useMemo, useState } from 'react';

import { ArrowLeft, ArrowRight, RotateCcw, RotateCw } from 'lucide-react';
import { ReactObsidianSetting } from 'react-obsidian-setting';

import { useSettingsContext } from '../../../../core/SettingsContext';
import { useUnitsHistoryContext } from '../context/HistoryContext';
import { useUnitsManagerContext } from '../context/UnitsManagerContext';
import {
    ButtonContainer,
    PaginationButton,
    PaginationControls,
    RedoButton,
    UndoButton,
} from './AvailableUnits.styled';
import { UnitItem } from './UnitItem';
import { usePagination } from './hooks/usePagination';
import { UnitOptionsModal } from './modals/UnitOptionsModal';
import { ModeState } from './types/interfaces';

const AvailableUnits: FC = () => {
    const { plugin } = useSettingsContext();
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
        const base = canChange ? `Go to ${type} page` : `No ${type} page`;
        const isOccupied = modeState.mode === 'edit';

        if (isOccupied && canChange) {
            return `Can't change page while editing`;
        }

        return base;
    };

    return (
        <>
            <ReactObsidianSetting
                name='Available image configs'
                setHeading
            />
            <ReactObsidianSetting
                name='Image configs per page'
                setDisabled={modeState.mode === 'edit'}
                addSliders={[
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
                    {`Page ${page} of ${totalPages} (Total image configs: ${units.length})`}
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
                <UnitItem
                    key={`${unit.name}-${unit.selector}`}
                    unit={unit}
                    index={pageStartIndex + index}
                    modeState={modeState}
                    setModeState={setModeState}
                />
            ))}

            {modeState.mode === 'options' && modeState.index !== -1 && (
                <UnitOptionsModal
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

export default AvailableUnits;
