"use client";

import { useEffect, useRef, useState } from "react";
import Chart, { TooltipItem, ChartConfiguration } from "chart.js/auto";

interface ProgressGraphProps {
  entries: {
    date: Date;
    mood: string;
    triggers: string[];
  }[];
}

type TimeFilter = "day" | "week" | "month";

const moodValues = {
  Great: 5,
  Good: 4,
  Neutral: 3,
  Anxious: 2,
  Stressed: 1,
  Tired: 0,
};

const triggerColors = {
  "Social Event": "rgb(239, 68, 68)", // red
  "Work Stress": "rgb(234, 179, 8)", // yellow
  "Family Issues": "rgb(34, 197, 94)", // green
  Boredom: "rgb(168, 85, 247)", // purple
  Celebration: "rgb(249, 115, 22)", // orange
};

export default function ProgressGraph({ entries }: ProgressGraphProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("day");

  // Function to destroy the chart
  const destroyChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  };

  // Effect to handle chart updates
  useEffect(() => {
    // Always destroy the chart when entries change
    destroyChart();

    // If there are no entries or no canvas, don't create a new chart
    if (!chartRef.current || entries.length === 0) {
      return;
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Filter entries based on selected time period
    const filteredEntries = filterEntriesByTime(entries, timeFilter);

    // Sort entries by date
    const sortedEntries = [...filteredEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Get all unique triggers
    const allTriggers = Array.from(
      new Set(filteredEntries.flatMap((entry) => entry.triggers))
    );

    const data = {
      labels: sortedEntries.map((entry) =>
        new Date(entry.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Mood",
          data: sortedEntries.map(
            (entry) => moodValues[entry.mood as keyof typeof moodValues]
          ),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
          yAxisID: "y",
        },
        ...allTriggers.map((trigger) => ({
          label: trigger,
          data: sortedEntries.map((entry) =>
            entry.triggers.includes(trigger) ? 1 : 0
          ),
          borderColor:
            triggerColors[trigger as keyof typeof triggerColors] ||
            "rgb(156, 163, 175)",
          backgroundColor: "rgba(156, 163, 175, 0.1)",
          tension: 0.4,
          fill: true,
          yAxisID: "y1",
          pointRadius: 6,
          pointHoverRadius: 8,
        })),
      ],
    };

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: function (tickValue: number | string) {
                if (typeof tickValue === "number") {
                  const mood = Object.entries(moodValues).find(
                    ([, v]) => v === tickValue
                  )?.[0];
                  return mood;
                }
                return tickValue;
              },
            },
            title: {
              display: true,
              text: "Mood Level",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            min: 0,
            max: 1,
            ticks: {
              stepSize: 1,
              callback: function (tickValue: number | string) {
                if (typeof tickValue === "number") {
                  return tickValue === 1 ? "Present" : "Absent";
                }
                return tickValue;
              },
            },
            title: {
              display: true,
              text: "Triggers",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top" as const,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem: TooltipItem<"line">) {
                const value = tooltipItem.raw as number;
                if (tooltipItem.dataset.label === "Mood") {
                  const mood = Object.entries(moodValues).find(
                    ([, v]) => v === value
                  )?.[0];
                  return `Mood: ${mood}`;
                }
                return `${tooltipItem.dataset.label}: ${value === 1 ? "Present" : "Absent"}`;
              },
            },
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      destroyChart();
    };
  }, [entries, timeFilter]);

  const filterEntriesByTime = (
    entries: ProgressGraphProps["entries"],
    filter: TimeFilter
  ) => {
    const now = new Date();
    const filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      switch (filter) {
        case "day":
          return entryDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return entryDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return entryDate >= monthAgo;
        default:
          return true;
      }
    });
    return filteredEntries;
  };

  // If there are no entries, don't render the graph section
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Your Progress</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeFilter("day")}
            className={`px-3 py-1 rounded transition-colors ${
              timeFilter === "day"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setTimeFilter("week")}
            className={`px-3 py-1 rounded transition-colors ${
              timeFilter === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeFilter("month")}
            className={`px-3 py-1 rounded transition-colors ${
              timeFilter === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
        </div>
      </div>
      <div className="h-[300px]">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
