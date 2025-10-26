import React, { useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full bg-gray-500" />,
});

export interface ChartConfigItem {
  label: string;
  color: string;
}

export type ChartConfig = Record<string, ChartConfigItem>;

interface DateRangeApexChartProps {
  data: Record<string, any>[];
  chartConfig: ChartConfig;
  title?: string;
  dateKey?: string;
  locale?: string;
  money?: boolean;
  className?: string;
}

const DateRangeApexChart: React.FC<DateRangeApexChartProps> = ({
  data,
  chartConfig,
  title = "Análise de Dados",
  dateKey = "date",
  locale = "pt-BR",
  money = false,
  className,
}) => {
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(a[dateKey]).getTime() - new Date(b[dateKey]).getTime()
    );
  }, [data, dateKey]);

  const seriesKeys = useMemo(() => {
    if (!chartConfig) return [];
    return Object.keys(chartConfig).filter((key) =>
      sortedData.some((d) => d[key] !== undefined)
    );
  }, [chartConfig, sortedData]);

  const series = useMemo(() => {
    return seriesKeys.map((key) => ({
      name: chartConfig[key]?.label || key,
      data: sortedData.map((item) => [
        new Date(item[dateKey]).getTime(),
        item[key],
      ]),
    }));
  }, [sortedData, seriesKeys, chartConfig, dateKey]);

  const colors = useMemo(() => {
    return seriesKeys.map((key) => chartConfig[key]?.color || "#000000");
  }, [seriesKeys, chartConfig]);

  const options: ApexOptions = useMemo(() => {
    return {
      chart: {
        id: "date-range-chart",
        type: chartType,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        zoom: {
          autoScaleYaxis: true,
        },
      },
      colors: colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          style: {
            colors: "white",
          },
          format: "dd MMM",
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "white",
          },
          formatter: (value: number) => {
            if (money) {
              return value.toLocaleString(locale, {
                style: "currency",
                currency: "BRL",
              });
            }
            return value.toLocaleString(locale);
          },
        },
      },
      tooltip: {
        theme: "dark",
        x: {
          format: "dd MMMM yyyy",
        },
        y: {
          formatter: (value: number) => {
            if (money) {
              return value.toLocaleString(locale, {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
              });
            }
            return value.toLocaleString(locale);
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        labels: {
          colors: "white",
        },
        onItemClick: {
          toggleDataSeries: true,
        },
        onItemHover: {
          highlightDataSeries: true,
        },
      },
    };
  }, [chartType, colors, locale, money]);

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type={chartType}
        height={300}
      />
    </div>
  );
};

export default DateRangeApexChart;
