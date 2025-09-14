"use client";

import { useState } from "react";
import { RatingDisplay } from "./RatingDisplay";
import Image from "next/image";

interface ImageGalleryProps {
  main_image: string;
  gallery: string[];
  rating: number;
}

export const ImageGallery = ({
  main_image,
  gallery,
  rating,
}: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(main_image);

  const allImages = [main_image, ...gallery];

  return (
    <div className="flex gap-2">
      <div className="relative w-full">
        <Image
          src={selectedImage}
          alt="Restaurant"
          className="w-full h-[400px] object-cover"
          width={800}
          height={600}
        />
        <RatingDisplay rating={rating} />
      </div>

      <div className="flex flex-col gap-1">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`cursor-pointer flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden border-2 transition-all ${
              selectedImage === image
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover"
              width={400}
              height={300}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
