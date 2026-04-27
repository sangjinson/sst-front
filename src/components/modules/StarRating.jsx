const StarRating = ({
  rating,
  icon = '★',
  theme = {},
}) => {
  const t = {
    size: 'text-sm',
    gap: 'gap-0.5',
    emptyColor: 'text-gray-300',
    fillColor: 'text-yellow-400',
    ...theme,
  };

  return (
    <div className={`flex items-center ${t.gap}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.min(
          Math.max((rating - (star - 1)) * 100, 0),
          100
        );

        return (
          <span key={star} className={`relative ${t.size}`}>
            <span className={t.emptyColor}>{icon}</span>

            <span
              className={`absolute left-0 top-0 overflow-hidden ${t.fillColor}`}
              style={{ width: `${fillPercent}%` }}
            >
              {icon}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;