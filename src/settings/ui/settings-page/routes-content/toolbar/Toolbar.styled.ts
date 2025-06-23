import styled from 'styled-components';

export const DesktopToolbar = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;

    &::before {
        content: '';
    }
`;
export const DesktopResetButtonWrapper = styled.div`
    justify-self: end;
    display: flex;
    align-items: center;
    margin-top: 35px;
`;
export const MobileResetButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: -50px;
    margin-right: 0;
    padding: 0;
    width: 100%;
    margin-bottom: 0;
`;
