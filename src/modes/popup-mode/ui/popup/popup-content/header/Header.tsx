import { usePopupContext } from '@/modes/popup-mode/ui/core/PopupContext';
import { BaseButton } from '@/modes/popup-mode/ui/popup/Popup.styled';
import { SHeader } from '@/modes/popup-mode/ui/popup/popup-content/header/Header.styled';
import { ViewMode } from '@/modes/popup-mode/ui/popup/types/definitions';

import { FC, useCallback } from 'react';

import { Minus, X } from 'lucide-react';

export const Header: FC<{
    setMode: (mode: ViewMode) => void;
}> = ({ setMode }) => {
    const { onClose } = usePopupContext();

    const onMinimize = useCallback(() => {
        setMode('minimized');
    }, []);

    return (
        <SHeader>
            <BaseButton
                onClick={onMinimize}
                data-tooltip='Minimize'
            >
                <Minus />
            </BaseButton>
            <BaseButton
                onClick={onClose}
                data-tooltip='Close'
            >
                <X />
            </BaseButton>
        </SHeader>
    );
};
