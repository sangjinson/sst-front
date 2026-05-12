import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipButton } from '@components/modules/ActionButtons';
import { getBadgeColor } from '@components/modules/area/arealist/areaListUtils';
import { getPlaceImages } from '@api/reviewApi';

const AreaDetailHero = ({
  image,
  name,
  category,
  categories = [],
  renderHeart,
  plcNo,
  listPath,
}) => {
  const badgeColor = getBadgeColor(categories, category);
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  // 이미지 목록 조회
  useEffect(() => {
    if (!plcNo) {
      setImages([{ pimgOgImgUrl: image }]);
      return;
    }
    getPlaceImages(plcNo)
      .then((data) => {
        if (data.length === 0) {
          setImages([{ pimgOgImgUrl: image }]);
        } else {
          setImages(data);
        }
      })
      .catch(() => {
        setImages([{ pimgOgImgUrl: image }]);
      });
  }, [plcNo, image]);

  const currentImage = images[current]?.pimgOgImgUrl || image;
  const total = images.length;

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % total);
  };

  return (
    <div className="relative rounded-lg overflow-hidden mb-6
                    aspect-[3/4] md:aspect-[16/4]
                    w-full h-auto">

      {/* 이미지 */}
      <img
        src={currentImage}
        alt={name}
        className="w-full h-full object-cover transition-all duration-300"
      />

      {/* 이름 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
        <span className={`inline-block px-4 py-1 rounded-full fs-up-2 font-semibold mb-1 ${badgeColor}`}>
          {category}
        </span>
        <h1 className="fs-up-7 font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {name}
        </h1>

        {/* 이미지 인디케이터 */}
        {total > 1 && (
          <div className="flex gap-1.5 mt-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  idx === current ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 공유 & 찜 버튼 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <ClipButton />
        {renderHeart && renderHeart()}
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => listPath ? navigate(listPath) : navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md text-gray-800 px-6 py-3 rounded-xl fs-up-2 font-semibold shadow-lg shadow-black/5 border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-200"
      >
        <span className="mb-0.5 text-lg">←</span> 목록으로
      </button>

      {/* 좌우 슬라이더 버튼 */}
      {total > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            ←
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            →
          </button>

          {/* 이미지 카운터 */}
          <div className="absolute bottom-16 right-5 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {current + 1} / {total}
          </div>
        </>
      )}
    </div>
  );
};

export default AreaDetailHero;