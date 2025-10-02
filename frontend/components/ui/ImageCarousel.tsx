'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface ImageCarouselProps {
    images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnimating) return;
        
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        
        setTimeout(() => setIsAnimating(false), 400);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnimating) return;
        
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        
        setTimeout(() => setIsAnimating(false), 400);
    };

    const handleDotClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnimating || index === currentIndex) return;
        
        setIsAnimating(true);
        setCurrentIndex(index);
        
        setTimeout(() => setIsAnimating(false), 400);
    };

    // Auto-play functionality (optional)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnimating) {
                setIsAnimating(true);
                setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                setTimeout(() => setIsAnimating(false), 400);
            }
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [images.length, isAnimating]);

    if (images.length === 0) return null;
    if (images.length === 1) {
        return (
            <div className="relative w-full h-96 mb-4">
                <img
                    src={images[0]}
                    alt="Post image"
                    className="w-full h-full object-cover rounded-lg transition-all duration-300 ease-in-out"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            </div>
        );
    }

    return (
        <div className="relative w-full h-96 mb-4 group overflow-hidden rounded-lg">
            {/* Sliding Container */}
            <div 
                className="flex h-full transition-transform duration-400 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-full h-full relative">
                        <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        
                        {/* Overlay gradient for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                onClick={handlePrevious}
                disabled={isAnimating}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                onClick={handleNext}
                disabled={isAnimating}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => handleDotClick(index, e)}
                        disabled={isAnimating}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === currentIndex 
                                ? 'bg-white scale-125 shadow-lg' 
                                : 'bg-white/60 hover:bg-white/80 hover:scale-110'
                        } ${isAnimating ? 'pointer-events-none' : ''}`}
                    />
                ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
