"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full bg-gray-500" />,
});

type DataItem = { name: string; value: number };

type PieChartProps = {
  data: DataItem[];
};

export default function PieChart({ data }: PieChartProps) {
  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.name);

  const palette = data.map(
    (_, index) => `hsl(${Math.round((360 / data.length) * index)}, 70%, 60%)`
  );

  const options: ApexOptions = {
    labels: labels,
    colors: palette,
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        shape: "circle",
      },
      labels: {
        colors: "white",
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
        },
      },
    },
    stroke: {
      width: 5,
      colors: ["#fff"],
    },

    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (value) => {
          const formattedValue = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value);

          return formattedValue;
        },
      },
    },
    responsive: [
      {
        breakpoint: 1280,
        options: {
          legend: {
            position: "right",
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="w-full h-full">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        width="100%"
        height="100%"
      />
    </div>
  );
}
