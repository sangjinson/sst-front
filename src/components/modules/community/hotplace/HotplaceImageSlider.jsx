
/*
 * 핫플거리 상세 페이지에서 이미지 슬라이드를 보여주는 컴포넌트입니다.

 * import HotplaceImageSlider from "@components/modules/community/hotplace/HotplaceImageSlider";

* 사용 예시:
 *
 * const [currentImageIndex, setCurrentImageIndex] = useState(0);
 *
 * const handlePrevImage = () => {
 *   setCurrentImageIndex((prev) =>
 *     prev === 0 ? slideImages.length - 1 : prev - 1
 *   );
 * };
 *
 * const handleNextImage = () => {
 *   setCurrentImageIndex((prev) =>
 *     prev === slideImages.length - 1 ? 0 : prev + 1
 *   );
 * };
 *
 * <HotplaceImageSlider
 *   slideImages={slideImages}
 *   currentImageIndex={currentImageIndex}
 *   setCurrentImageIndex={setCurrentImageIndex}
 *   currentPost={post}
 *   handlePrevImage={handlePrevImage}
 *   handleNextImage={handleNextImage}

*/


const HotplaceImageSlider = ({
  slideImages,
  currentImageIndex,
  setCurrentImageIndex,
  currentPost,
  handlePrevImage,
  handleNextImage,
}) => {
  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="relative h-[400px] overflow-hidden bg-gray-100">
          <img src={slideImages[currentImageIndex]} alt={currentPost.title} className="h-full w-full object-cover" />

          <div className="absolute left-5 top-5 z-20 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
            {currentPost.place}
          </div>

          <button type="button" onClick={handlePrevImage}
            className="absolute left-4 top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button type="button" onClick={handleNextImage}
            className="absolute right-4 top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center gap-2">
            {slideImages.map((image, index) => (
              <button key={image} type="button" onClick={() => setCurrentImageIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  currentImageIndex === index
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/80"
                }`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HotplaceImageSlider;