import { useEffect, useState } from "react";

export const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    if (imageUrls.length > 0) {
      const promises = imageUrls.map((imageUrl) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            setLoadedImages((prev) => [...prev, imageUrl]);
            resolve(imageUrl);
          };
        });
      });

      Promise.all(promises);
    }
  }, [imageUrls]);

  return { loadedImages, isLoading: loadedImages.length < imageUrls.length };
};
