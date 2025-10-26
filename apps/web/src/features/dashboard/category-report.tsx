"use client";

import PieChart from "@components/pie-chart";
import { useStore } from "@store/store.context";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

const CategoryReport = observer(() => {
  const { dashboardStore } = useStore();

  const items =
    dashboardStore.dashboardData?.expenseByCategoryCurrentMonth ?? [];

  const data = useMemo(
    () =>
      items.map((item) => ({
        name: item.categoryName,
        value: item.expense,
      })) || [],
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Nenhum dado aqui
      </div>
    );
  }

  return <PieChart data={data} />;
});

export default CategoryReport;
