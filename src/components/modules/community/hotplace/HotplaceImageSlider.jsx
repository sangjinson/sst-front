import ImageSlider from "@components/modules/community/common/ImageSlider";

const HotplaceImageSlider = ({
  slideImages,
  currentPost,
}) => {
  return (
    <ImageSlider
      images={slideImages}
      alt={currentPost.title}
      label={currentPost.place} // ✅ 핫플만 사용하는 뱃지
      height="h-[400px]"        // ✅ 핫플 전용 크기
    />
  );
};

export default HotplaceImageSlider;