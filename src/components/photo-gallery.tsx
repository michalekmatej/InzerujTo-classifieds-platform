"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { Image as ImageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PhotoGalleryProps {
    images: ImageType[];
    title: string;
}

export default function PhotoGallery({ images, title }: PhotoGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [slideDirection, setSlideDirection] = useState<
        "left" | "right" | null
    >(null);

    // Use a placeholder if no images are available
    const hasImages = images && images.length > 0;
    const currentImage = hasImages ? images[activeIndex] : null;

    // Find the cover image and make it the first one to display
    const coverImageIndex = images?.findIndex((img) => img.isCover);

    // Initialize with cover image if available
    useEffect(() => {
        if (coverImageIndex !== -1) {
            setActiveIndex(coverImageIndex);
        }
    }, [coverImageIndex]);

    // Reset loading state when image changes
    useEffect(() => {
        setIsLoading(true);
    }, [activeIndex]);
    const handlePrevious = () => {
        setSlideDirection("left");
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSlideDirection("right");
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleThumbnailClick = (index: number) => {
        setSlideDirection(index > activeIndex ? "right" : "left");
        setActiveIndex(index);
    };

    const toggleFullscreen = () => {
        setShowFullscreen(!showFullscreen);
        // When exiting fullscreen, reset body scroll
        if (showFullscreen) {
            document.body.style.overflow = "";
        } else {
            // Prevent scrolling when in fullscreen
            document.body.style.overflow = "hidden";
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showFullscreen) return;

            if (e.key === "ArrowLeft") {
                handlePrevious();
            } else if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === "Escape") {
                toggleFullscreen();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = ""; // Reset on unmount
        };
    }, [showFullscreen]);

    return (
        <div className="relative w-full">
            {/* Main image container */}
            <div className="relative aspect-square overflow-hidden rounded-lg">
                {/* Image */}
                <Image
                    src={
                        currentImage?.url ||
                        "/placeholder.svg?height=600&width=600"
                    }
                    alt={`${title} - obrázek ${activeIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Navigation arrows */}
                {hasImages && images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                            onClick={toggleFullscreen}
                        >
                            <ZoomIn className="h-5 w-5" />
                        </Button>
                    </>
                )}

                {/* Image counter */}
                {hasImages && images.length > 1 && (
                    <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                        {activeIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {hasImages && images.length > 1 && (
                <div className="mt-2 flex space-x-2 overflow-x-auto py-2">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className={cn(
                                "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded border-2",
                                activeIndex === index
                                    ? "border-orange-500"
                                    : "border-transparent"
                            )}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <Image
                                src={image.url}
                                alt={`${title} - náhled ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Fullscreen overlay */}
            {showFullscreen && currentImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                    onClick={toggleFullscreen}
                >
                    <div className="relative h-[90vh] w-[90vw]">
                        <Image
                            src={currentImage.url}
                            alt={title}
                            fill
                            className="object-contain"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                            onClick={toggleFullscreen}
                        >
                            <ZoomIn className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
