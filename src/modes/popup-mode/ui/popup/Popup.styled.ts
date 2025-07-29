import styled from 'styled-components';

export const BaseButton = styled.button`
    position: relative;

    &::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: black;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s;
    }

    &:hover::after {
        opacity: 1;
        visibility: visible;
    }
`;

export const Overlay = styled.div`
    position: fixed;
    cursor: pointer;
    font-size: 0;
    line-height: 0;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    height: 100vh;
    width: 100vw;

    display: flex;
    flex-direction: column;
`;
