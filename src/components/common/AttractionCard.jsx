import React from 'react';

const AttractionCard = ({ item }) => {
    return (
        <div className="attraction-card">
        <div className="attraction-card-img">
            <img src={item.image} alt={item.title} />

            {/* ❤️ 좋아요 */}
            <button className="attraction-like">♡</button>

            {/* 태그 */}
            <span className="attraction-tag">{item.tag}</span>
        </div>

        <div className="attraction-card-body">
            {/* 제목 + 평점 */}
            <div className="attraction-title-row">
            <h3>{item.title}</h3>
            <span className="attraction-rating">⭐ 0.0</span>
            </div>

            {/* 설명 */}
            <p className="attraction-desc">
            {item.desc || '설명이 들어가는 영역입니다.'}
            </p>

            {/* 주소 */}
            <p className="attraction-location">
            <span className="location-icon">📍</span>
            {item.location}
            </p>
        </div>
        </div>
    );
};

export default AttractionCard;