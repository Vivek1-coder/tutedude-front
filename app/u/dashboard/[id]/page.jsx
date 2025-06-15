"use client";
import { usePathname } from "next/navigation";
import { LabReport } from "../../../components/LabReport";
import React, { useState, useEffect } from "react";
import axios from "axios";
export default function LabReportDisplay({ params }) {
  const pathname = usePathname();
  // console.log(id);
  console.log("jjojojojojj");
  const [metric, setMetric] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [explaination, setExplaination] = useState("");
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState([]);
  useEffect(() => {
    async function f() {
      console.log("lolololo");
      const id = (await params).id;
      console.log(id);
      const res = await axios.post(`/api/load-report/specific`, { id });
      console.log(res);
      setMetric(res.data.summary.metrics);
      setRemarks(res.data.summary.remarks);
      setExplaination(res.data.summary.explaination);
      setInsights(res.data.summary.actionable_insights);
      setSummary(res.data.summary.summary);
    }
    f();
  }, []);
  /**  metrics,
  remarks,
  summary,
  explanation,
  actionable_insights, */
  return (
    <div>
      <LabReport
        metrics={metric}
        remarks={remarks}
        explaination={explaination}
        actionable_insights={insights}
        summary={summary}
      ></LabReport>
    </div>
  );
}
