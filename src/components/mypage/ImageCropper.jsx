import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropper = ({ image, aspect, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onCropCompleteInternal = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
        {/* 헤더 */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800 tracking-tight">이미지 편집</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 크롭 영역 */}
        <div className="relative w-full h-80 bg-gray-50">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* 컨트롤 영역 */}
        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">확대/축소</label>
              <span className="text-xs font-bold text-[#0F9B73]">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0F9B73]"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all"
            >
              취소
            </button>
            <button
              onClick={() => onCropComplete(croppedAreaPixels)}
              className="flex-1 py-4 bg-[#0F9B73] text-white font-black rounded-2xl hover:bg-[#0d8a66] transition-all shadow-lg shadow-[#0F9B73]/20"
            >
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;