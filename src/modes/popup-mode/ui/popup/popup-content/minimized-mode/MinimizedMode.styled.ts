import { BaseButton } from '@/modes/popup-mode/ui/popup/Popup.styled';

import styled from 'styled-components';

export const MinimizedButton = styled(BaseButton)<{ $x: number; $y: number }>`
    position: fixed;
    bottom: ${(props) => props.$y}px;
    right: ${(props) => props.$x}px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    margin: 0;

    user-select: none;
`;
export const Badge = styled.div`
    position: absolute;
    top: -5px;
    right: -5px;
    background: red;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
