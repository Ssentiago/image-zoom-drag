import styled from 'styled-components';

export const MiniNavbar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--color-base-30);

    .button-active {
        background: var(--interactive-accent);
        color: var(--text-on-accent);
        transform: scale(1.05);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    button {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
    }
`;
