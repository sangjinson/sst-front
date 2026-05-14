import { useEffect, useRef, useState } from 'react';

const ExpandingSearch = ({
  value,
  onChange,
  onSubmit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

    updateIsDesktop();
    mediaQuery.addEventListener('change', updateIsDesktop);

    return () => mediaQuery.removeEventListener('change', updateIsDesktop);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleBlur = (e) => {
    if (!searchRef.current?.contains(e.relatedTarget)) {
      setIsExpanded(false);
    }
  };

  const expandedClass = isExpanded
    ? 'md:w-[820px] shadow-[0_18px_55px_rgba(15,23,42,0.12)]'
    : 'md:w-[360px]';

  const contentClass = isExpanded
    ? 'md:w-full md:opacity-100 md:pointer-events-auto'
    : 'md:w-0 md:opacity-0 md:pointer-events-none';
  const controlTabIndex = !isDesktop || isExpanded ? 0 : -1;

  return (
    <form
      ref={searchRef}
      onSubmit={handleSubmit}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        if (!searchRef.current?.contains(document.activeElement)) {
          setIsExpanded(false);
        }
      }}
      onFocus={() => setIsExpanded(true)}
      onBlur={handleBlur}
      className={`group mx-auto flex h-[72px] w-full max-w-[92vw] items-center overflow-hidden rounded-full border border-white/70 bg-white/75 px-6 shadow-[0_12px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 ease-out md:h-20 ${expandedClass}`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="hidden shrink-0 bg-transparent p-0 text-base font-semibold text-gray-500 outline-none transition-colors duration-300 hover:text-[#2B4A48] focus:text-[#2B4A48] md:flex md:text-lg"
        aria-label="검색창 열기"
      >
        <span
          className={`hidden whitespace-nowrap transition-all duration-300 md:block md:overflow-hidden ${
            isExpanded ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100'
          }`}
        >
          어디로 떠날까요?
        </span>
      </button>

      <div className={`ml-3 flex min-w-0 flex-1 items-center opacity-100 transition-all duration-500 md:ml-4 ${contentClass}`}>
        <select
          tabIndex={controlTabIndex}
          className="hidden h-10 shrink-0 cursor-pointer border-0 border-r border-gray-200 bg-transparent pr-5 text-base font-semibold text-gray-700 outline-none md:block md:text-lg"
          aria-label="지역 선택"
          defaultValue=""
        >
          <option value="">지역 선택</option>
        </select>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="떠나고 싶은 지역이나 테마를 입력하세요"
          tabIndex={controlTabIndex}
          className="min-w-0 flex-1 bg-transparent px-3 text-base font-medium text-gray-800 outline-none placeholder:text-gray-400 md:px-5 md:text-lg"
        />

        <button
          type="submit"
          tabIndex={controlTabIndex}
          className="shrink-0 rounded-full bg-[#2B4A48] px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-[#0F9B73] active:scale-95 md:px-7"
        >
          검색
        </button>
      </div>
    </form>
  );
};

export default ExpandingSearch;
