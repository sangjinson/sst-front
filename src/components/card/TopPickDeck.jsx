import { useEffect, useMemo, useRef, useState } from 'react';

const categoryOrder = ['see', 'food', 'play', 'sleep'];

const categorySlots = {
  see: 'far-left',
  food: 'left',
  play: 'right',
  sleep: 'far-right',
};
const tagStyles = {
  볼거리: 'bg-[#E8F7EE] text-[#0F9B73]',
  먹거리: 'bg-[#FFF2E8] text-[#E26338]',
  놀거리: 'bg-[#EEF4FF] text-[#3B82F6]',
  잘거리: 'bg-[#F3E8FF] text-[#8B5CF6]',
};

const slotPositions = {
  'far-left':
  'md:-translate-x-[calc(50%+560px)] md:-translate-y-1/2 md:-rotate-[8deg] md:scale-[0.92]',

left:
  'md:-translate-x-[calc(50%+280px)] md:-translate-y-1/2 md:-rotate-[4deg] md:scale-[0.97]',

center:
  'md:-translate-x-1/2 md:-translate-y-1/2 md:rotate-0 md:scale-[1.1]',

right:
  'md:translate-x-[calc(-50%+280px)] md:-translate-y-1/2 md:rotate-[4deg] md:scale-[0.97]',

'far-right':
  'md:translate-x-[calc(-50%+560px)] md:-translate-y-1/2 md:rotate-[8deg] md:scale-[0.92]',
};

const collapsedPosition =
  'md:-translate-x-1/2 md:-translate-y-1/2 md:rotate-0 md:scale-[0.92]';

const layerBySlot = {
  'far-left': 'z-10',
  left: 'z-30',
  center: 'z-50',
  right: 'z-30',
  'far-right': 'z-10',
};

const delayBySlot = {
  center: 'delay-0',
  left: 'delay-[40ms]',
  right: 'delay-[80ms]',
  'far-left': 'delay-[120ms]',
  'far-right': 'delay-[160ms]',
};

const getItemKey = (item) => `${item.type}-${item.id}`;

const TopPickDeck = ({ items, onDetailClick }) => {
  const [selectedKey, setSelectedKey] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMotionKey, setSelectedMotionKey] = useState('');
  const selectedMotionTimerRef = useRef(null);

  useEffect(() => {
    if (items.length === 0) return;

    const selectedStillExists = items.some(
      (item) => getItemKey(item) === selectedKey
    );

    if (!selectedStillExists) {
      setSelectedKey(getItemKey(items[0]));
    }
  }, [items, selectedKey]);

  useEffect(() => {
    if (items.length === 0) return;

    setIsExpanded(false);

    const timer = window.setTimeout(() => {
      setIsExpanded(true);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [items]);

  useEffect(() => {
    return () => window.clearTimeout(selectedMotionTimerRef.current);
  }, []);

  const selectedItem =
    items.find((item) => getItemKey(item) === selectedKey) || items[0];

  const displayItems = useMemo(() => {
    if (!selectedItem) return [];

    const realItems = categoryOrder
      .map((type) => items.find((item) => item.type === type))
      .filter(Boolean)
      .map((item) => {
        const key = getItemKey(item);
        const isSelected = key === getItemKey(selectedItem);

        return {
          item,
          key,
          slot: isSelected ? 'center' : categorySlots[item.type],
          isSelected,
          isGhost: false,
        };
      });

    return [
      ...realItems,
      {
        item: selectedItem,
        key: `${getItemKey(selectedItem)}-filler`,
        slot: categorySlots[selectedItem.type],
        isSelected: false,
        isFiller: true,
      },
    ];
  }, [items, selectedItem]);

  if (displayItems.length === 0) return null;

  const shouldExpand = isExpanded || isFocused;

  const selectItem = (itemKey, isFiller = false) => {
    if (isFiller || itemKey === selectedKey) return;

    window.clearTimeout(selectedMotionTimerRef.current);
    setIsFocused(true);
    setSelectedMotionKey(itemKey);
    setSelectedKey(itemKey);

    selectedMotionTimerRef.current = window.setTimeout(() => {
      setSelectedMotionKey('');
    }, 760);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="hidden md:block">
        <div className="relative mx-auto h-[430px] max-w-[1700px]">
          {displayItems.map(({ item, key, slot, isSelected, isFiller }) => {
            const positionClass = shouldExpand
  ? `${slotPositions[slot]} opacity-100`
  : `${collapsedPosition} opacity-100`;
	            const imageSrc =
	              typeof item.img === 'string' ? item.img.trim() : item.img;
	            const isSelectedMotion = isSelected && selectedMotionKey === key;
	            const imageMotionClass =
	              isFiller || isSelected
	                ? ''
	                : 'transition-transform duration-300 group-hover:scale-[1.03]';
	            const cardSurfaceClass = isSelected
	              ? `border-[#0F9B73] ${isSelectedMotion ? "ring-[#0F9B73]/45" : "ring-[#0F9B73]/30"} ring-2 shadow-[0_26px_66px_rgba(15,23,42,0.22),0_0_0_1px_rgba(15,155,115,0.22)]`
	              : `${isFiller ? "shadow-[0_12px_32px_rgba(15,23,42,0.1)]" : "hover:shadow-[0_22px_54px_rgba(15,23,42,0.16)]"}`;
	
	            return (
	              <article
	                key={key}
	                role={isFiller ? undefined : 'button'}
                tabIndex={isFiller ? -1 : 0}
                aria-hidden={isFiller ? 'true' : undefined}
                onClick={() => selectItem(key, isFiller)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectItem(key, isFiller);
                  }
                }}
	                className={`group absolute left-1/2 top-1/2 h-[360px] w-[250px] transform-gpu transition-[translate,rotate,scale,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${shouldExpand ? delayBySlot[slot] : 'delay-0'} will-change-transform focus:outline-none ${isFiller ? 'pointer-events-none cursor-default opacity-70' : isSelected ? 'cursor-default' : 'cursor-pointer'} ${layerBySlot[slot]} ${positionClass}`}
	              >
	                <div
	                  className={`relative h-full w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] transition-[box-shadow,border-color,filter] duration-300 ease-out ${isFiller ? 'grayscale-[40%] brightness-[0.64] saturate-75' : ''} ${cardSurfaceClass}`}
	                >
	                  {imageSrc ? (
	                    <img
	                      src={imageSrc}
	                      alt={item.title}
	                      className={`h-full w-full object-cover ${imageMotionClass}`}
	                    />
	                  ) : (
	                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-400">
	                      이미지 준비중
	                    </div>
	                  )}

	                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pb-4 pt-16 text-white">
	                    <span
	                      className={`mb-2 inline-block rounded px-2.5 py-1 text-sm font-semibold ${
	                        tagStyles[item.tag] || 'bg-gray-100 text-gray-700'
	                      }`}
	                    >
	                      {item.tag}
	                    </span>
	                    <h4 className="line-clamp-1 text-[1.45rem] font-bold transition-colors duration-300 group-hover:text-[#52D0A6]">
	                      {item.title}
	                    </h4>
	                    <p className="mt-1 line-clamp-1 text-base text-white/80">
	                      {item.desc}
	                    </p>
	                  </div>
	                  {isSelected && (
	                    <button
	                      type="button"
	                      onClick={(e) => {
	                        e.stopPropagation();
	                        onDetailClick(item.type, item);
	                      }}
	                      className={`group/detail absolute right-0 top-[72%] z-30 flex cursor-pointer items-center gap-2 rounded-l-2xl rounded-r-none border border-r-0 border-white/65 bg-white/90 px-5 py-3 text-base font-semibold text-gray-900 shadow-[0_14px_30px_rgba(15,23,42,0.22)] backdrop-blur-sm transition-[translate,opacity,color,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#0F9B73]/50 hover:bg-white hover:text-[#0F9B73] active:brightness-95 ${
	                        shouldExpand
	                          ? 'translate-x-0 opacity-100 delay-[220ms] hover:delay-0'
	                          : 'translate-x-2 opacity-0 delay-0'
	                      }`}
	                    >
	                      <span className="leading-none">상세보기</span>
	                      <span className="leading-none text-lg -translate-y-[1px] transition-transform duration-300 group-hover/detail:translate-x-0.5">
	                        →
	                      </span>
	                    </button>
	                  )}
	                </div>
	              </article>
            );
          })}
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:hidden">
        {displayItems
          .filter(({ isFiller }) => !isFiller)
          .map(({ item, key, isSelected }) => {
            const imageSrc =
              typeof item.img === 'string' ? item.img.trim() : item.img;

            return (
              <article
  key={key}
  onClick={() => {
    selectItem(key);
    onDetailClick(item.type, item);
  }}
  className="group relative h-[310px] min-w-[78%] snap-center cursor-pointer overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.14)] transition-[transform,box-shadow] duration-300"
>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-400">
                    이미지 준비중
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pb-4 pt-16 text-white">
                  <span
  className={`mb-2 inline-block rounded px-2.5 py-1 text-sm font-semibold ${
    tagStyles[item.tag] || 'bg-gray-100 text-gray-700'
  }`}
>
  {item.tag}
</span>
                  <h4 className="line-clamp-1 text-lg font-bold">
                    {item.title}
                  </h4>
                  <p className="mt-1 line-clamp-1 text-sm text-white/75">
                    {item.desc}
                  </p>
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
};

export default TopPickDeck;
