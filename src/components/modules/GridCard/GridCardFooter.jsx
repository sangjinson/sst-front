const GridCardFooter = ({ children, className = "" }) => {
  return (
    <div className={`px-4 py-3 border-t ${className}`}>
      {children}
    </div>
  );
};

export default GridCardFooter;