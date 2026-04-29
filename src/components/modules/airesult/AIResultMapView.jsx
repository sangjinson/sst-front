import React, { useState } from 'react';

const TYPE_LABEL = {
  see:   '볼거리',
  food:  '먹거리',
  sleep: '잘거리',
};

const TYPE_COLOR = {
  see:   'bg-blue-100 text-blue-700',
  food:  'bg-orange-100 text-orange-700',
  sleep: 'bg-green-100 text-green-700',
};

const AIResultMapView = ({ selectedRegion, schedule, activeDay, selectedItem, onSelectItem }) => {
  const currentDayItems = schedule[activeDay] || [];

  const handlePrev = () => {
    const idx = currentDayItems.findIndex(i => i.id === selectedItem?.id);
    if (idx > 0) onSelectItem(currentDayItems[idx - 1]);
  };

  const handleNext = () => {
    const idx = currentDayItems.findIndex(i => i.id === selectedItem?.id);
    if (idx < currentDayItems.length - 1) onSelectItem(currentDayItems[idx + 1]);
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* 지도 */}
      <div className="w-full flex-1 bg-gray-100 relative" style={{ minHeight: '480px' }}>
        <iframe
          title="지도"
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', inset: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedRegion)}&z=12&output=embed`}
        />
        <a
          href={`https://maps.google.com/maps?q=${encodeURIComponent(selectedRegion)}`}
          target="_blank"
          rel="noreferrer"
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs text-gray-600 shadow hover:bg-white transition z-10"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          큰 지도로 보기
        </a>
      </div>

      {/* 미니 상세 카드 */}
      {selectedItem ? (
        <div className="border-t border-gray-100 bg-white px-4 py-3 flex items-center gap-3">
          {/* 이전 버튼 */}
          <button
            onClick={handlePrev}
            disabled={currentDayItems.findIndex(i => i.id === selectedItem.id) === 0}
            className="text-gray-400 hover:text-gray-600 text-2xl shrink-0 disabled:opacity-30"
          >
            ‹
          </button>

          {/* 이미지 */}
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400">{selectedItem.time}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLOR[selectedItem.type]}`}>
                {TYPE_LABEL[selectedItem.type]}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">{selectedItem.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 truncate">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current shrink-0" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {selectedItem.desc}
            </p>
          </div>

          {/* 찜 버튼 */}
          <button className="text-red-400 hover:text-red-500 transition text-xl shrink-0">
            ♥
          </button>

          {/* 다음 버튼 */}
          <button
            onClick={handleNext}
            disabled={currentDayItems.findIndex(i => i.id === selectedItem.id) === currentDayItems.length - 1}
            className="text-gray-400 hover:text-gray-600 text-2xl shrink-0 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      ) : (
        <div className="border-t border-gray-100 bg-white px-4 py-4 text-center text-sm text-gray-400">
          왼쪽 일정 목록에서 장소를 클릭하면 상세 정보를 볼 수 있어요
        </div>
      )}

    </div>
  );
};

export default AIResultMapView;