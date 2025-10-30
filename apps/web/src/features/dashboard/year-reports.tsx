import React, { useMemo } from "react";
import { useStore } from "@store/store.context";
import { observer } from "mobx-react-lite";
import DateRangeApexChart, { ChartConfig } from "@/src/components/line-chart";

const ReportsLine = observer(() => {
  const { dashboardStore } = useStore();
  const raw = dashboardStore.dashboardData?.transactionPerMonth ?? [];

  const chartData = useMemo(() => {
    if (!raw || !raw.length) return [];

    const normalized = raw.map((item) => {
      const monthKey = (item.monthKey ?? item.label ?? "").toString().trim();

      let dateIso = "";
      if (/^\d{4}-\d{2}$/.test(monthKey)) {
        dateIso = `${monthKey}-01`;
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(monthKey)) {
        dateIso = monthKey;
      } else {
        const parsed = new Date(monthKey || item.label || "");
        dateIso = isNaN(parsed.getTime())
          ? new Date().toISOString()
          : parsed.toISOString();
      }

      return {
        key: dateIso,
        incoming: item.data?.incoming ?? 0,
        expense: item.data?.expense ?? 0,
        balance: item.data?.balance ?? 0,
        label: item.label ?? monthKey,
      };
    });

    return normalized.sort(
      (a, b) => new Date(a.key).getTime() - new Date(b.key).getTime()
    );
  }, [raw]);

  const chartConfig = {
    incoming: { label: "Entradas", color: "green" },
    expense: { label: "Saídas", color: "red" },
    balance: { label: "Saldo", color: "white" },
  } satisfies ChartConfig;

  return (
    <DateRangeApexChart
      data={chartData}
      chartConfig={chartConfig}
      dateKey="key"
      title="Transações por Mês"
      money={true}
    />
  );
});

export default ReportsLine;
