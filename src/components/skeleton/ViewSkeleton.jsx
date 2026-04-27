import React from 'react';

const ViewSkeleton = () => {
  return (
    <div className="min-h-screen bg-white animate-pulse pb-20">
      <div className="w-full h-[300px] md:h-[500px] bg-gray-200"></div>
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 border-b border-gray-100 pb-8">
          <div className="h-8 md:h-10 bg-gray-300 rounded w-3/4 md:w-1/2 mb-4"></div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
        <div className="space-y-4 mb-12">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
            <div className="h-[250px] md:h-[350px] bg-gray-200 rounded-xl"></div>
          </div>
          <div className="md:col-span-1 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-24 mb-4"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSkeleton;