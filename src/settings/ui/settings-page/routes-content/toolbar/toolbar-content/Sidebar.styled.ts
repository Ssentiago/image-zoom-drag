import styled from 'styled-components';

export const SidebarButton = styled.button`
    z-index: 101;
`;

export const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
`;

interface SectionProps {
    $nested?: boolean;
    $active?: boolean;
}

export const Section = styled.div<SectionProps>`
    padding: 5px 10px;
    border-bottom: 1px solid var(--background-modifier-border);
    margin-left: ${(props) => (props.$nested ? '20px' : '0')};
    background-color: ${(props) =>
        props.$active ? 'var(--interactive-accent)' : 'transparent'};
    border-left: ${(props) =>
        props.$active
            ? '3px solid var(--text-accent)'
            : '3px solid transparent'};
    cursor: pointer;
    transition: all 0.2s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${(props) =>
            props.$active
                ? 'var(--interactive-accent-hover)'
                : 'var(--background-modifier-hover)'};
    }
`;
export const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    svg {
        transition: transform 0.2s ease;
    }
`;
export const SidebarContainer = styled.div`
    background: var(--background-primary);
    position: absolute;
    height: 100%;
    width: 250px;
    top: 0;
    left: 0;
    z-index: 100;
    border-right: 1px solid var(--border-color);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    transform: translateX(-100%);
    animation: slideIn 0.3s ease forwards;

    @keyframes slideIn {
        to {
            transform: translateX(0);
        }
    }
`;
export const SidebarContent = styled.div`
    padding-top: 60px; /* высота кнопки + отступ */
    height: 100%;
    overflow-y: auto;
`;
export const CollapsibleSection = styled.div<{ $expanded: boolean }>`
    overflow: hidden;
    max-height: ${(props) => (props.$expanded ? '200px' : '0')};
    transition: max-height 0.3s ease;
`;
