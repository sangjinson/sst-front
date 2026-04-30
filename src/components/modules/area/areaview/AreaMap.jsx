import React from 'react';

/**
 * AreaMap - 뷰 페이지 공통 지도 섹션
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import AreaMap from '@components/modules/areaview/AreaMap';
 *
 * // 2. 위도/경도로 사용 (잘거리)
 * <AreaMap lat={item.lat} lng={item.lng} address={item.address} />
 *
 * // 3. 주소 문자열로 사용 (먹거리/볼거리)
 * <AreaMap address={item.address} />
 * ────────────────────────────────────────────────
 *
 * props:
 * - lat     : 위도 (선택 - 있으면 위도/경도로 검색)
 * - lng     : 경도 (선택 - 있으면 위도/경도로 검색)
 * - address : 주소 (lat/lng 없을 때 주소로 검색)
 */
const AreaMap = ({ lat, lng, address }) => {
  // lat/lng 있으면 좌표로, 없으면 주소로 검색
  const query = lat && lng
    ? `${lat},${lng}`
    : encodeURIComponent(address);

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-3">위치</h2>
      <div className="w-full h-52 rounded-xl overflow-hidden bg-gray-100">
        <iframe
          title="지도"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
        />
      </div>
      {address && (
        <p className="text-xs text-gray-400 mt-2">📍 {address}</p>
      )}
    </div>
  );
};

export default AreaMap;