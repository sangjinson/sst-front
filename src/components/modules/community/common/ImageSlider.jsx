import { useState } from "react";

const ImageSlider = ({
  images = [],
  alt = "",
  label = "",
  height = "h-[400px]",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className={`relative ${height} overflow-hidden bg-gray-100`}>
        <img
          src={images[currentIndex]}
          alt={alt}
          className="h-full w-full object-cover"
        />

        {/* label 값이 있을 때만 표시 */}
        {label && (
          <div className="absolute left-5 top-5 z-20 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
            {label}
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white active:scale-95"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white active:scale-95"
            >
              ›
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  currentIndex === index
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;