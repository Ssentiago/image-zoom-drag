import styled from 'styled-components';

export const SmoothAnimatedItem = styled.div<{ $isVisible: boolean }>`
    transform: ${(props) => (props.$isVisible ? 'scaleY(1)' : 'scaleY(0)')};
    transform-origin: top;
    opacity: ${(props) => (props.$isVisible ? 1 : 0)};
    max-height: ${(props) => (props.$isVisible ? '1000px' : '0px')};
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    & > * {
        transition: transform 0.3s ease;
        transform: ${(props) =>
            props.$isVisible ? 'translateY(0)' : 'translateY(-10px)'};
    }
`;
