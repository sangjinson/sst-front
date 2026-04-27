const GridCard = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        bg-white rounded-2xl overflow-hidden
        shadow-sm hover:shadow-lg
        transition-all duration-300
        cursor-pointer group
        ${className}
      `}
    >
      {children}
    </div>
  );
};


export default GridCard;