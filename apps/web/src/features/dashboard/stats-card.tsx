import { Skeleton } from "@/src/components/ui/skeleton";
import { useStore } from "@/src/store/store.context";
import { Badge } from "@components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { observer } from "mobx-react-lite";
import { ElementType } from "react";

export interface StatsCardProps {
  description: string;
  value: number;
  trendIcon?: ElementType;
  percentage?: number;
  trendVariant?: "blue" | "red" | "green";
  actionHide?: boolean;
}

const StatsCard = observer(
  ({
    description,
    value,
    trendIcon: TrendIcon,
    percentage,
    trendVariant,
    actionHide = false,
  }: StatsCardProps) => {
    const formattedValue = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const { dashboardStore } = useStore();

    if (!dashboardStore.hydrated) {
      return (
        <Card className="p-0">
          <Skeleton className="h-[110px] w-full bg-gray-500" />
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardDescription>{description}</CardDescription>
          <CardTitle className="text-2xl font-semibold">
            {formattedValue}
          </CardTitle>
          {!actionHide && TrendIcon && (
            <CardAction>
              <Badge
                variant="outline"
                style={{ backgroundColor: trendVariant }}
              >
                <TrendIcon className="mr-1 size-4" />
                {percentage}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
      </Card>
    );
  }
);

export default StatsCard;
