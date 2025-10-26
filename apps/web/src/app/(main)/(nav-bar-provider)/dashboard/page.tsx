"use client";

import { Card } from "@components/ui/card";
import CategoryReport from "@features/dashboard/category-report";
import ChartAreaInteractive from "@features/dashboard/year-reports";
import { observer } from "mobx-react-lite";
import DisplayItems from "@features/transactions/display-transaction";
import RevenueStats from "@features/dashboard/revenue-stats";
import SpentStats from "@features/dashboard/expense-stats";
import BalanceStats from "@features/dashboard/balance-stats";
import { useStore } from "@/src/store/store.context";

const DashboardPage = observer(() => {
  const { dashboardStore } = useStore();
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <RevenueStats />
        <SpentStats />
        <BalanceStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 md:col-span-3 px-1">
          <span className="font-semibold ml-2">Relatório de Gastos</span>
          <ChartAreaInteractive />
        </Card>
        <Card className="xl:h-full xl:col-span-1 md:col-span-3 md:h-[350px] px-3">
          <span className="font-semibold">Relatório por Categoria</span>
          <CategoryReport />
        </Card>

        <Card className="lg:col-span-3 px-4 h-[25vh]">
          <div className="flex flex-col gap-4 h-full w-full">
            <DisplayItems type="all" showSkeleton={!dashboardStore.hydrated} />
          </div>
        </Card>
      </div>
    </div>
  );
});

export default DashboardPage;
