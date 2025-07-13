import { t, tf } from '@/lang';
import { ImageConfigs } from '@/modes/integrated-mode/interactify-unit/types/constants';

import React, { FC, useState } from 'react';

import { OSetting } from '@obsidian-devkit/native-react-components';

import { useUnitsValidation } from '../hooks/useUnitsValidation';
import { useImageConfigOperations } from './hooks/useImageConfigOperations';
import { UnitItemProps } from './types/interfaces';

export const ImagePreset: FC<UnitItemProps> = ({
    unit,
    index,
    modeState,
    setModeState,
}) => {
    const [nameError, setNameError] = useState('');
    const [selectorError, setSelectorError] = useState('');

    const { validateName, validateSelector } = useUnitsValidation();

    const { handleSaveEditing, handleDelete, handleToggle } =
        useImageConfigOperations();

    const onKeyDown = async (e: React.KeyboardEvent) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            const result = await handleSaveEditing(index);
            if (result) {
                setNameError(result.nameResult.tooltip);
                setSelectorError(result.selectorResult.tooltip);
            }
        }
    };

    return modeState.index === index && modeState.mode === 'edit' ? (
        <OSetting>
            <input
                id={'editing-name-input'}
                type={'text'}
                defaultValue={unit.name}
                className={nameError.trim() ? 'invalid' : ''}
                aria-label={nameError}
                onChange={(e) => {
                    const value = e.target.value;
                    const validationResult = validateName(value, unit);
                    setNameError(validationResult.tooltip);
                }}
                onKeyDown={onKeyDown}
            />
            <input
                id='editing-selector-input'
                type={'text'}
                defaultValue={unit.selector}
                className={selectorError.trim() ? '' : ''}
                aria-label={selectorError}
                onChange={(e) => {
                    const value = e.target.value;
                    const validationResult = validateSelector(value, unit);
                    setSelectorError(validationResult.tooltip);
                }}
                onKeyDown={onKeyDown}
            />
            <button
                aria-label={
                    t.settings.pages.images.presets.availableImageConfigs.item
                        .buttons.cancel
                }
                onClick={() => {
                    setModeState({
                        index: -1,
                        mode: 'none',
                    });
                }}
                data-icon={'circle-x'}
            />
            <button
                aria-label={tf(
                    t.settings.pages.images.presets.availableImageConfigs.item
                        .buttons.save,
                    { name: unit.name }
                )}
                onClick={async () => {
                    const result = await handleSaveEditing(index);
                    if (result) {
                        setNameError(result.nameResult.tooltip);
                        setSelectorError(result.selectorResult.tooltip);
                    } else {
                        setModeState({
                            index: -1,
                            mode: 'none',
                        });
                    }
                }}
                data-icon={'save'}
            />
        </OSetting>
    ) : (
        <OSetting
            name={unit.name}
            desc={unit.selector}
        >
            <input
                type={'checkbox'}
                defaultChecked={unit.on}
                aria-label={
                    unit.on
                        ? tf(
                              t.settings.pages.images.presets
                                  .availableImageConfigs.item.toggle.disable,
                              {
                                  name: unit.name,
                              }
                          )
                        : tf(
                              t.settings.pages.images.presets
                                  .availableImageConfigs.item.toggle.enable,
                              {
                                  name: unit.name,
                              }
                          )
                }
                onChange={async (e) => {
                    await handleToggle(index, e.target.checked);
                }}
            />

            {![ImageConfigs.IMG_SVG, ImageConfigs.Default].contains(
                unit.selector as ImageConfigs
            ) && (
                <>
                    <button
                        aria-label={tf(
                            t.settings.pages.images.presets
                                .availableImageConfigs.item.buttons.edit,
                            {
                                name: unit.name,
                            }
                        )}
                        onClick={async () => {
                            setModeState({
                                index,
                                mode: 'edit',
                            });
                        }}
                        data-icon={'edit'}
                    />

                    <button
                        aria-label={tf(
                            t.settings.pages.images.presets
                                .availableImageConfigs.item.buttons.delete,
                            {
                                name: unit.name,
                            }
                        )}
                        onClick={async () => {
                            await handleDelete(index);
                        }}
                        data-icon={'trash'}
                    />
                </>
            )}
            <button
                aria-label={tf(
                    t.settings.pages.images.presets.availableImageConfigs.item
                        .buttons.options,
                    { name: unit.name }
                )}
                onClick={() => {
                    setModeState({
                        index,
                        mode: 'options',
                    });
                }}
                data-icon={'settings'}
            />
        </OSetting>
    );
};
