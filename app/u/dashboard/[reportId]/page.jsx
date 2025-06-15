import { LabReport } from "../../../components/LabReport";

export function Display({ metrics, remarks }) {
  return <LabReport metrics={metrics} remarks={remarks}></LabReport>;
}
