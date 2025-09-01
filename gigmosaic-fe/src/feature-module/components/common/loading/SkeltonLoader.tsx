import { Skeleton } from '@heroui/react';

const HeroSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Title & Booking Info Skeleton */}
      <div className="flex items-center justify-between flex-wrap mb-2">
        <div>
          <div className="lg:flex block items-center lg:flex-wrap">
            <Skeleton className="rounded-lg">
              <div className="h-6 bg-gray-400 rounded w-48 mb-2 mr-2"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-5 bg-gray-400 rounded w-32 py-1 px-1"></div>
            </Skeleton>
          </div>
          <div className="lg:flex items-center flex-wrap mb-2">
            <Skeleton className="rounded-lg">
              <div className="h-5 bg-gray-400 rounded w-56 mb-2"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-5 bg-gray-400 rounded w-40 mb-2"></div>
            </Skeleton>
          </div>
        </div>
        <Skeleton className="rounded-lg">
          <div className="h-12 bg-gray-400 rounded w-28"></div>
        </Skeleton>
      </div>

      {/* Slider Skeleton */}
      <div className="mb-6 relative rounded-sm bg-white border-none flex flex-col">
        <Skeleton className="rounded-lg">
          <div className="h-48 bg-gray-400 rounded w-full mb-4"></div>
        </Skeleton>

        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton className="rounded-lg">
              <div key={i} className="h-16 w-16 bg-gray-400 rounded"></div>
            </Skeleton>
          ))}
        </div>
      </div>

      {/* Pricing Skeleton */}
      <div className="mb-6 bg-white shadow-small relative rounded-sm border-0 p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="rounded-lg">
            <div className="h-6 bg-gray-400 rounded w-24"></div>
          </Skeleton>
          <Skeleton className="rounded-lg">
            <div className="h-5 bg-gray-400 rounded w-20"></div>
          </Skeleton>
        </div>
        <Skeleton className="rounded-lg">
          <div className="h-12 bg-gray-400 rounded w-full mb-4"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-6 bg-gray-400 rounded w-32 mb-2"></div>
        </Skeleton>

        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between pb-2 mb-2 border-dashed border-b"
          >
            <Skeleton className="rounded-lg">
              <div className="h-5 bg-gray-400 rounded w-40"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-5 bg-gray-400 rounded w-16"></div>
            </Skeleton>
          </div>
        ))}
        <Skeleton className="rounded-lg">
          <div className="h-10 bg-gray-400 rounded w-full mb-3"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-10 bg-gray-400 rounded w-full"></div>
        </Skeleton>
      </div>
    </div>
  );
};

export default HeroSkeleton;
