"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// type Metric = {
//   value: number | null,
//   normalRange: string | null,
// };

// type LabReportProps = {
//   metrics: Record<string, Metric>,
//   remarks?: string,
// };

export function LabReport({ metrics, remarks }) {
  // Parse normalRange strings into numeric [min, max]
  const parsedData = Object.entries(metrics).map(
    ([name, { value, normalRange }]) => {
      let min = NaN,
        max = NaN;
      if (normalRange) {
        const nums = normalRange.match(/[\d.]+/g);
        if (nums) {
          min = parseFloat(nums[0]);
          max = nums.length > 1 ? parseFloat(nums[1]) : min;
        }
      }
      return {
        name,
        value: value !== null ? parseFloat(String(value)) : null,
        min,
        max,
      };
    }
  );

  // Utility to check out-of-range
  const isOutOfRange = (d) =>
    d.value !== null &&
    (!isFinite(d.min) || !isFinite(d.max)
      ? false
      : d.value < d.min || d.value > d.max);

  return (
    <div className="space-y-8">
      {/* 1. Remarks Callout */}
      {remarks && (
        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-900">
          <strong>Remarks:</strong> {remarks}
        </div>
      )}

      {/* 2. Metrics Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Metric</th>
              <th className="px-4 py-2 text-right">Value</th>
              <th className="px-4 py-2 text-center">Normal Range</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {parsedData.map((d) => (
              <tr
                key={d.name}
                className={
                  isOutOfRange(d)
                    ? "bg-red-50 hover:bg-red-100"
                    : "hover:bg-gray-50"
                }
              >
                <td className="px-4 py-2">{d.name}</td>
                <td className="px-4 py-2 text-right">
                  {d.value !== null ? d.value : "—"}
                </td>
                <td className="px-4 py-2 text-center">
                  {isFinite(d.min) && isFinite(d.max)
                    ? `${d.min} – ${d.max}`
                    : "—"}
                </td>
                <td className="px-4 py-2 text-center">
                  {d.value === null ? (
                    "—"
                  ) : isOutOfRange(d) ? (
                    <span className="font-semibold text-red-600">⚠️</span>
                  ) : (
                    <span className="font-semibold text-green-600">✔️</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {parsedData.map((d) => (
          <div key={d.name} className="h-48 p-4 border rounded-lg">
            <h3 className="mb-2 font-medium">{d.name}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[d]}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
              >
                <XAxis type="number" domain={[d.min * 0.8, d.max * 1.2]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={false}
                />
                <Tooltip formatter={(v) => v} />
                {/* shading normal range */}
                {isFinite(d.min) && isFinite(d.max) && (
                  <ReferenceLine
                    x={d.min}
                    stroke="gray"
                    strokeDasharray="3 3"
                  />
                )}
                {isFinite(d.min) && isFinite(d.max) && (
                  <ReferenceLine
                    x={d.max}
                    stroke="gray"
                    strokeDasharray="3 3"
                  />
                )}
                <Bar
                  dataKey="value"
                  barSize={20}
                  isAnimationActive={false}
                  fill={isOutOfRange(d) ? undefined : undefined}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* 4. Download as CSV */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          const rows = [["Metric", "Value", "Normal Range"]];
          parsedData.forEach((d) => {
            rows.push([
              d.name,
              d.value?.toString() ?? "",
              isFinite(d.min) && isFinite(d.max) ? `${d.min}-${d.max}` : "",
            ]);
          });
          const csv = rows.map((r) => r.join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "lab-report.csv";
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Download CSV
      </button>
    </div>
  );
}
