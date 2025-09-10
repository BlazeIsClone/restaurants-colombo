"use client";

import { useState } from "react";
import { RatingDisplay } from "./RatingDisplay";

interface ImageGalleryProps {
    main_image: string;
    gallery: string[];
    rating: number;
}

export const ImageGallery = ({ main_image, gallery, rating }: ImageGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState(main_image);

    const allImages = [main_image, ...gallery];

    return (
        <div className="space-y-3">
            <div className="relative">
                <img
                    src={selectedImage}
                    alt="Restaurant"
                    className="w-full h-[400px] object-cover rounded-lg shadow-md"
                />
                <RatingDisplay rating={rating} />
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all ${selectedImage === image
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};
