import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CommunityLifeDetailSkeleton = () => {
  return (
    <div className="paperlogy min-h-screen bg-[#f7f8fa] font-sans">
      <div className="container mx-auto min-h-[70vh] py-8 px-5 lg:px-[50px] xl:px-[250px] mb-20">
        <div className="mb-8">
          <Skeleton width={180} height={18} />
          <div className="mt-4">
            <Skeleton width={220} height={34} />
          </div>
          <div className="mt-3">
            <Skeleton width="70%" height={18} />
          </div>
        </div>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <Skeleton height={400} borderRadius={20} />
            <Skeleton height={150} borderRadius={24} />
            <Skeleton height={220} borderRadius={24} />
            <Skeleton height={360} borderRadius={24} />
          </div>

          <div>
            <Skeleton height={620} borderRadius={24} />
          </div>
        </section>

        <div className="mt-10">
          <Skeleton height={220} borderRadius={24} />
        </div>
      </div>
    </div>
  );
};

export default CommunityLifeDetailSkeleton;