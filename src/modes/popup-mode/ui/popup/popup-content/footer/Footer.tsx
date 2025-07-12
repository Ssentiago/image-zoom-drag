import { usePopupContext } from '@/modes/popup-mode/ui/core/PopupContext';
import { BaseButton } from '@/modes/popup-mode/ui/popup/Popup.styled';

import { useEffect, useState } from 'react';

import styled from 'styled-components';

const SFooter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px;
`;

const Counter = styled.div`
    color: #fff;
    font-size: 14px;
    font-weight: 500;
`;

const GalleryContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
`;

const generateThumbnail = (
    image: HTMLImageElement,
    maxWidth = 150,
    maxHeight = 150
): Promise<string> => {
    return new Promise((resolve) => {
        const crossOriginImage = new Image();
        crossOriginImage.crossOrigin = 'anonymous';

        crossOriginImage.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(image.src);
                return;
            }

            const ratio = Math.min(
                maxWidth / crossOriginImage.naturalWidth,
                maxHeight / crossOriginImage.naturalHeight
            );
            const newWidth = crossOriginImage.naturalWidth * ratio;
            const newHeight = crossOriginImage.naturalHeight * ratio;

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(crossOriginImage, 0, 0, newWidth, newHeight);

            try {
                resolve(canvas.toDataURL('image/png', 0.7));
            } catch (e) {
                resolve(image.src);
            }
        };

        crossOriginImage.onerror = () => {
            resolve(image.src);
        };

        crossOriginImage.src = image.src;
    });
};

const ThumbnailButton = styled(BaseButton)<{ $isActive: boolean }>`
    width: 60px;
    height: 60px;
    margin: 0;
    border: ${(props) =>
        props.$isActive ? '2px solid #007acc' : '1px solid #ccc'};

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const Footer = () => {
    const { images, activeImageIndex, setActiveImageIndex } = usePopupContext();
    const [thumbnails, setThumbnails] = useState<string[]>([]);

    useEffect(() => {
        const generateThumbnails = async () => {
            const thumbs = await Promise.all(
                images.map(async (image) => {
                    if (image instanceof HTMLImageElement) {
                        return await generateThumbnail(image);
                    }
                    return '';
                })
            );
            setThumbnails(thumbs);
        };

        generateThumbnails();
    }, [images]);

    return (
        <SFooter>
            <Counter>
                {activeImageIndex + 1} / {images.length}
            </Counter>
            <GalleryContainer>
                {thumbnails.map((thumb, index) => (
                    <ThumbnailButton
                        key={index}
                        $isActive={index === activeImageIndex}
                        onClick={() => setActiveImageIndex(index)}
                    >
                        <img
                            src={thumb}
                            alt={`Thumbnail ${index}`}
                        />
                    </ThumbnailButton>
                ))}
            </GalleryContainer>
        </SFooter>
    );
};
export default Footer;
