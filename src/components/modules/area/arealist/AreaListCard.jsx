import React, {useEffect}  from 'react';
import { GridCard, GridCardHeader, GridCardBody, GridCardFooter } from '@components/modules/GridCard';
import StarRating from '@components/modules/StarRating';
import { BADGE_COLORS } from '@components/modules/area/arealist/areaListUtils';
import { HeartButton } from '@components/modules/ActionButtons';
import IconSVG from "@components/Icon/IconSVG";

import AOS from "aos";
import "aos/dist/aos.css";

const DEFAULT_IMAGES = {
  '볼거리': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
  '먹거리': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  '잘거리': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
  '놀거리': 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=400&q=80',
};

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80';

const AreaListCard = ({ item, categories, liked, onLike, onClick, renderHeart }) => {
  useEffect(() => { AOS.init(); }, []);

  const name        = item.name        || item.title    || '';
  const category    = item.category    || item.tag      || '';
  const description = item.description || item.desc     || '';
  const location    = item.location    || item.address  || '';
  const reviewCount = item.reviewCount ?? item.reviews  ?? 0;

  const badgeColorIdx =
    (Array.isArray(categories)
      ? categories.filter((c) => c !== '전체').indexOf(category)
      : 0);

  const safeBadgeColorIdx = badgeColorIdx >= 0 ? badgeColorIdx : 0;
  const badgeColor = BADGE_COLORS[safeBadgeColorIdx % BADGE_COLORS.length];

  const defaultImg = DEFAULT_IMAGES[category] || DEFAULT_FALLBACK;

  return (
    <div data-aos="fade-up" data-aos-once="true">
      <GridCard onClick={onClick}>
        <GridCardHeader className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={item.image || defaultImg}
              alt={name}
              className="w-full h-full aspect-[4/3] sm:aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = defaultImg; }}
            />
            <span className={`absolute top-3 left-3 px-4 py-1 rounded-full fs-up-1 font-semibold ${badgeColor}`}>
              {category}
            </span>
            <div className="absolute top-2 right-2">
              {renderHeart ? renderHeart() : <HeartButton liked={liked} onClick={onLike} />}
            </div>
          </div>
        </GridCardHeader>

        <GridCardBody className="px-4 py-3">
          <h3 className="font-bold text-gray-900 fs-up-3 truncate group-hover:text-[#E8956D] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 mt-2 py-1 fs-up-1">
            <IconSVG name="location" size={17} className="shrink-0 fill-none stroke-[#E8956D]" strokeWidth={2}/>
            <span className="text-gray-800 truncate">{location}</span>
          </div>
          <div className="flex items-center gap-3 py-1 mb-2 fs-up-1">
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-yellow-400">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
              </svg>
              <span className="font-semibold text-gray-700">
                {Number(item.rating).toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
              <span>{reviewCount}</span>
            </div>
          </div>
        </GridCardBody>

        <GridCardFooter className="flex items-center gap-1 fs-up-1">
          <p className="text-gray-500 line-clamp-2">{description}</p>
        </GridCardFooter>
      </GridCard>
    </div>
  );
};

export default AreaListCard;