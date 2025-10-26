import { observer } from "mobx-react-lite";
import StatsCard, { StatsCardProps } from "./stats-card";
import { useStore } from "@store/store.context";

const BalanceStats = observer(() => {
  const { dashboardStore } = useStore();
  const currentMonth = dashboardStore.dashboardData?.currentMonth;
  const statsData: StatsCardProps = {
    description: "Balanço",
    value: currentMonth?.balance || 0,
    actionHide: true,
  };

  return <StatsCard key={statsData.description} {...statsData} />;
});

export default BalanceStats;
