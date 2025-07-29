import styled, { keyframes } from 'styled-components';

export const SRoutesContent = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
`;
const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;
export const SRoutesContainer = styled.div`
    > * {
        animation: ${slideIn} 0.3s ease;
    }
`;
