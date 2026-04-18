import BaseImageGallery from '@/components/ImageGallery';

interface ImageGalleryProps {
    images?: string[];
    autoPlayTime?: number;
    aspectRatio?: string;
}

export default function ImageGallery({
    images = [],
    autoPlayTime = 5000,
    aspectRatio = 'aspect-[4/3]',
}: ImageGalleryProps) {
    return (
        <BaseImageGallery
            images={images}
            autoPlayTime={autoPlayTime}
            aspectRatio={aspectRatio}
            emptyMessage="Dang cap nhat hinh anh..."
            activeThumbnailClassName="border-indigo-500 ring-2 ring-indigo-500/20 opacity-100 scale-105"
        />
    );
}
