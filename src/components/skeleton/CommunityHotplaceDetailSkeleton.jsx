import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CommunityHotplaceDetailSkeleton = () => {
  return (
    <div className="paperlogy container mx-auto min-h-screen py-8 px-5 lg:px-[50px] xl:px-[250px] mb-20 font-sans">
      <div className="mb-8">
        <Skeleton width={180} height={18} />
        <div className="mt-4">
          <Skeleton width={240} height={34} />
        </div>
        <div className="mt-3">
          <Skeleton width="70%" height={18} />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:items-stretch">
        <div className="space-y-6">
          <Skeleton height={400} borderRadius={20} />
          <Skeleton height={180} borderRadius={24} />
          <Skeleton height={260} borderRadius={24} />
        </div>

        <div>
          <Skeleton height={620} borderRadius={24} />
        </div>
      </section>

      <div className="mt-10">
        <Skeleton height={240} borderRadius={24} />
      </div>
    </div>
  );
};

export default CommunityHotplaceDetailSkeleton;