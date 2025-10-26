import { observer } from "mobx-react-lite";
import StatsCard, { StatsCardProps } from "./stats-card";
import { useStore } from "@store/store.context";
import { TrendingDown, TrendingUp } from "lucide-react";

const SpentStats = observer(() => {
  const { dashboardStore } = useStore();
  const currentMonth = dashboardStore.dashboardData?.currentMonth;
  const statsData: StatsCardProps = {
    description: "Gasto Mensal",
    value: currentMonth?.expense || 0,
    percentage: currentMonth?.expensePercent,
    trendIcon: currentMonth?.expensePercent
      ? currentMonth?.expensePercent >= 0
        ? TrendingUp
        : TrendingDown
      : undefined,
    trendVariant: currentMonth?.expensePercent
      ? currentMonth?.expensePercent >= 0
        ? "red"
        : "green"
      : undefined,
  };

  return <StatsCard key={statsData.description} {...statsData} />;
});

export default SpentStats;
