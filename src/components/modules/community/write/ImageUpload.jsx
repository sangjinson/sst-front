
const ImageUpload = ({
  imagePreviews,
  setImagePreviews,
  handleImageChange,
}) => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <label className="block fs-down-2 font-bold text-gray-700">
          사진 등록
        </label>

        <label className="w-40 h-12 shrink-0 flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>

          <p className="fs-down-1 font-semibold text-gray-400">
            사진 추가
          </p>

          <input
            type="file"
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
            multiple
          />
        </label>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-lg overflow-hidden border">
              <img
                src={preview}
                alt={`미리보기 ${index + 1}`}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  setImagePreviews(imagePreviews.filter((_, i) => i !== index))
                }
                className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center">
                ✕
              </button>
            </div>
          ))}
        </div>

        {imagePreviews.length === 0 && (
          <div className="w-full h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400">
            등록된 사진이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;