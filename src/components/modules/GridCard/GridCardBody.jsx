const GridCardBody = ({ children, className = "" }) => {
  return (
    <div className={` ${className}`}>
      {children}
    </div>
  );
};

export default GridCardBody;