import { Card } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="w-full h-full grid grid-cols-6 grid-rows-23 gap-4 auto-rows-[110px] p-4">
      <div className="col-span-6 row-span-2 flex flex-row justify-between">
        <div className="flex flex-col gap-1 px-2">
          <Skeleton className="h-full w-96 bg-gray-500" />
        </div>
        <Skeleton className="h-full w-40 rounded-l-4xl rounded-r-2xl bg-gray-500" />
      </div>
      <Card className="col-span-2 row-span-3 p-4">
        <Skeleton className="h-full w-full bg-gray-500" />
      </Card>
      <Card className="col-span-2 row-span-3 p-4">
        <Skeleton className="h-full w-full bg-gray-500" />
      </Card>
      <Card className="col-span-2 row-span-3 p-4">
        <Skeleton className="h-full w-full bg-gray-500" />
      </Card>
      <Card className="col-span-6 row-span-9 p-4 gap-0 overflow-hidden">
        <Skeleton className="h-full w-full bg-gray-500" />
      </Card>

      <Card className="col-span-3 row-span-9 p-4">
        <Skeleton className="h-full w-full bg-gray-500" />
      </Card>

      <Card className="col-span-3 gap-5 row-span-9 p-5">
        <Skeleton className="h-full w-full bg-gray-500" />
      </Card>
    </div>
  );
};
