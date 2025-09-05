"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Tab = "WEEKLY" | "YEARLY";

const SalesGraph = () => {
  const [activeTab, setActiveTab] = useState<Tab>("WEEKLY");

  // Sample data
  const weeklyData = [
    { name: "Week 1", value: 120 },
    { name: "Week 2", value: 230 },
    { name: "Week 3", value: 180 },
    { name: "Week 4", value: 310 },
  ];

  const yearlyData = [
    { name: "2020", value: 1200 },
    { name: "2021", value: 1800 },
    { name: "2022", value: 2100 },
    { name: "2023", value: 2900 },
  ];

  const getActiveData = () => {
    if (activeTab === "YEARLY") return yearlyData;
    return weeklyData;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      {/* Header with Tabs */}
      <div className="flex items-center sm:flex-nowrap flex-wrap justify-between border-b border-[#232321]/20 pb-3 mb-9">
        <h2 className="text-lg font-semibold">Sale Graph</h2>
        <div className="flex space-x-4 sm:flex-nowrap flex-wrap">
          {(["WEEKLY", "YEARLY"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-open-sans font-semibold text-sm px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-[#003F62] text-white"
                  : "bg-transparent text-[#232321] border border-[#232321]/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={getActiveData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280" }}
            />
            <Line
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              type="monotone"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesGraph;
