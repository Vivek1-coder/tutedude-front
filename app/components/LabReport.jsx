"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

// type Metric = {
//   value: number | null;
//   normalRange: string | null;
// };

// type LabReportProps = {
//   metrics: Record<string, Metric>;
//   remarks?: string;
//   summary?: string;
//   explanation?: string;
//   actionable_insights?: string[];
// };

export function LabReport({
  metrics,
  remarks,
  summary,
  explanation,
  actionable_insights,
}) {
  const [showExplanation, setShowExplanation] = useState(false);

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

  const isOutOfRange = (d) =>
    d.value !== null &&
    isFinite(d.min) &&
    isFinite(d.max) &&
    (d.value < d.min || d.value > d.max);

  return (
    <div className="space-y-10">
      {/* Remarks Section */}
      {remarks && (
        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-900">
          <strong>Remarks:</strong> {remarks}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
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
                <td className="px-4 py-2 text-right">{d.value ?? "—"}</td>
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

      {/* Chart Grid */}
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
                {isFinite(d.min) && isFinite(d.max) && (
                  <>
                    <ReferenceLine
                      x={d.min}
                      stroke="gray"
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      x={d.max}
                      stroke="gray"
                      strokeDasharray="3 3"
                    />
                  </>
                )}
                <Bar dataKey="value" barSize={20} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* CSV Download */}
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

      {/* Summary */}
      {summary && (
        <div className="p-4 rounded border bg-blue-50 text-blue-900 shadow-sm">
          <strong>Summary:</strong> {summary}
        </div>
      )}

      {/* Actionable Insights */}
      {actionable_insights?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Actionable Insights
          </h2>
          <ul className="space-y-2 list-disc list-inside">
            {actionable_insights.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation Accordion */}
      {explanation && (
        <div className="rounded border bg-white shadow">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-100"
          >
            <span>Detailed Explanation</span>
            {showExplanation ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showExplanation && (
            <div className="px-4 pb-4 text-gray-700">{explanation}</div>
          )}
        </div>
      )}
    </div>
  );
}
