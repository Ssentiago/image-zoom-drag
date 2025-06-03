import React from 'react';
import { ReactObsidianSetting } from 'react-obsidian-setting';
import { useSettingsContext } from '../../../../core/context';
import DiagramSize from './components/diagram-size/diagram-size';
import { ToggleComponent } from 'obsidian';
import DiagramFolding from './components/diagram-folding/DiagramFolding';

/**
 * A React component that renders a settings page for diagrams.
 *
 * This component uses `ReactObsidianSetting` to create toggles for folding
 * diagrams by default and for automatically folding diagrams on focus change.
 *
 * It also renders a component for setting the size of the diagram.
 *
 * @returns A React element for the settings page.
 */
const DiagramsSettings: React.FC = (): React.ReactElement => {
    const { plugin } = useSettingsContext();

    return (
        <>
            <DiagramSize />

            <DiagramFolding />
        </>
    );
};

export default DiagramsSettings;
