const GridCardHeader = ({ children, className = "" }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

export default GridCardHeader;