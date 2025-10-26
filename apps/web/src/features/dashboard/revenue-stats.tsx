import { observer } from "mobx-react-lite";
import StatsCard, { StatsCardProps } from "./stats-card";
import { useStore } from "@store/store.context";
import { TrendingDown, TrendingUp } from "lucide-react";
import { toJS } from "mobx";

const RevenueStats = observer(() => {
  const { dashboardStore } = useStore();
  const currentMonth = dashboardStore.dashboardData?.currentMonth;
  console.log(toJS(dashboardStore.dashboard));
  const statsData: StatsCardProps = {
    description: "Receita Mensal",
    value: currentMonth?.incoming || 0,
    percentage: currentMonth?.incomingPercent,
    trendIcon: currentMonth?.incomingPercent
      ? currentMonth?.incomingPercent >= 0
        ? TrendingUp
        : TrendingDown
      : undefined,
    trendVariant: currentMonth?.incomingPercent
      ? currentMonth?.incomingPercent >= 0
        ? "green"
        : "red"
      : undefined,
  };

  return <StatsCard key={statsData.description} {...statsData} />;
});

export default RevenueStats;
