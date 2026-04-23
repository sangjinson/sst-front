import { iconsList } from './icons';

/**
 * 1. strokeWidth 제어
 * <IconSVG name="park" strokeWidth={2} />
 * 2. className 지원 (Tailwind / CSS)
 * <IconSVG name="park" className="text-blue-500 hover:text-red-500" />
 * 3. style 직접 주입
 * <IconSVG name="park" style={{ opacity: 0.5 }} />
 * 4. 이벤트 처리
 * <IconSVG name="play" onClick={() => alert('clicked')} />
 * 
 */

const IconSVG = ({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  className = '',
  style = {},
  onClick,
}) => {
  const key = name?.toLowerCase().trim();
  const icon = iconsList[key];

  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      {icon.node}
    </svg>
  );
};

export default IconSVG;