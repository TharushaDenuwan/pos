"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  mainImage: string;
}

export function ProductImageGallery({ images, mainImage }: ProductImageGalleryProps) {
  const allImages = images?.length > 0 ? images : [mainImage];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-[40px] bg-secondary/30 ring-1 ring-black/5 group">
        <img
          src={selectedImage}
          alt="Product"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={cn(
                "relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl ring-2 transition-all",
                selectedImage === img ? "ring-primary shadow-lg scale-95" : "ring-transparent grayscale-[30%] hover:grayscale-0"
              )}
            >
              <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
