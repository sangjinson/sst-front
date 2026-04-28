import React from 'react';

const TopPickCard = ({ item, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="relative rounded-xl overflow-hidden sm:aspect-[3/4] min-h-[220px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-1.5 transition-transform duration-300"
    >
      <img 
        src={item.img} 
        alt={item.title} 
        className="w-full h-full object-cover block" 
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-[30px] pb-5 px-5 text-white">
        <span className="fs-up-1 bg-primary text-white px-2 py-0.5 rounded-sm mb-2 inline-block font-semibold">
          {item.tag}
        </span>
        <h4 className="fs-up-3 font-bold mb-1">{item.title}</h4>
        <p className="fs-up-2 text-gray-300 line-clamp-1">{item.desc}</p>
      </div>
    </div>
  );
};

export default TopPickCard;