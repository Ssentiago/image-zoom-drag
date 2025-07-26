import { FC, ReactNode } from 'react';

import styled from 'styled-components';

const HelpSectionContainer = styled.div`
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const HelpTitle = styled.h3`
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-normal);
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: 8px;
`;

const HelpContent = styled.div`
    color: var(--text-muted);
    line-height: 1.6;

    p {
        margin: 0 0 12px 0;

        &:last-child {
            margin-bottom: 0;
        }
    }

    kbd {
        background: var(--background-modifier-border);
        border: 1px solid var(--background-modifier-border-hover);
        border-radius: 3px;
        padding: 2px 6px;
        font-size: 0.85em;
        font-family: var(--font-monospace);
        color: var(--text-normal);
    }

    strong {
        color: var(--text-normal);
        font-weight: 600;
    }

    code {
        background: var(--code-background);
        padding: 2px 4px;
        border-radius: 3px;
        font-family: var(--font-monospace);
        font-size: 0.9em;
    }
`;

interface HelpSectionProps {
    title: string;
    children: ReactNode;
}

const HelpSection: FC<HelpSectionProps> = ({ title, children }) => (
    <HelpSectionContainer>
        <HelpTitle>{title}</HelpTitle>
        <HelpContent>{children}</HelpContent>
    </HelpSectionContainer>
);

export default HelpSection;
