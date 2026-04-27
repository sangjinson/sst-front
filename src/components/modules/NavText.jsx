import { Link } from 'react-router-dom';

const NavText = ({ items }) => {
  return (
    <div className="flex items-center text-sm text-gray-400 mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            {isLast ? (
              <span className="text-gray-700 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="cursor-pointer hover:text-[#0F9B73] transition-colors"
              >
                {item.label}
              </Link>
            )}
            {!isLast && <span className="mx-2">{'>'}</span>}
          </div>
        );
      })}
    </div>
  );
};

export default NavText;