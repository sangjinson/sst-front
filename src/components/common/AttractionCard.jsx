import React from 'react';

const AttractionCard = ({ item }) => {
    return (
        <div className="card">
        <div className="card-img">
            <img src={item.image} alt={item.title} />

            {/* 태그 */}
            <span className="tag">{item.tag}</span>

            {/* 좋아요 버튼 */}
            <button className="like">♡</button>
        </div>

        <div className="card-body">
            <h3>{item.title}</h3>
            <p>{item.location}</p>
        </div>
        </div>
    );
};

export default AttractionCard;