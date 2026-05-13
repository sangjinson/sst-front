/**
 * @param {string} imageSrc - 원본 이미지 데이터 (base64)
 * @param {Object} pixelCrop - react-easy-crop에서 받은 픽셀 좌표
 */
export const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  
  // 이미지가 완전히 로드될 때까지 대기
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // 자를 영역만큼 캔버스 크기 설정
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // 🚀 캔버스에 그리기 (가장 중요한 부분!)
  ctx.drawImage(
    image,
    pixelCrop.x, // 원본 이미지에서 자를 시작 X
    pixelCrop.y, // 원본 이미지에서 자를 시작 Y
    pixelCrop.width, // 자를 너비
    pixelCrop.height, // 자를 높이
    0, // 캔버스에 그릴 시작 X
    0, // 캔버스에 그릴 시작 Y
    pixelCrop.width, // 캔버스에 그릴 너비
    pixelCrop.height // 캔버스에 그릴 높이
  );

  // 🚀 캔버스 내용을 파일(Blob)로 변환하여 리턴
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', 0.9); // 90% 품질의 JPEG로 압축
  });
};