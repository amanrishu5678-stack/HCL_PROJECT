import axios from "axios";
const configuredBaseURL = import.meta.env.VITE_API_URL?.trim();
export const apiConfigured = import.meta.env.DEV || Boolean(configuredBaseURL);
const baseURL = configuredBaseURL
  ? configuredBaseURL.replace(/\/+$/, "")
  : import.meta.env.DEV
    ? "http://localhost:8000"
    : "";

export const api = axios.create({baseURL});
function expectArray<T>(data: unknown, endpoint: string): T[] {
  if (!Array.isArray(data)) {
    throw new Error(`Invalid response from ${endpoint}; check the backend API deployment.`);
  }
  return data as T[];
}

function expectObject<T>(data: unknown, endpoint: string, requiredFields: string[]): T {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data) ||
    requiredFields.some((field) => !(field in data))
  ) {
    throw new Error(`Invalid response from ${endpoint}; check the backend API deployment.`);
  }
  return data as T;
}

export async function getEquipment(){return expectArray((await api.get("/api/equipment")).data, "/api/equipment")}
export async function getOverview(){return expectObject((await api.get("/api/analytics/overview")).data, "/api/analytics/overview", ["total_equipment", "online_devices", "average_health", "active_alerts"])}
export async function getAlerts<T = unknown>(){return expectArray<T>((await api.get("/api/alerts")).data, "/api/alerts")}
export async function getStatus(){return expectObject((await api.get("/api/system/status")).data, "/api/system/status", ["backend", "ai"])}
export async function getTelemetry<T = unknown>(id:string){return expectArray<T>((await api.get(`/api/equipment/${id}/telemetry`)).data, "/api/equipment telemetry")}
export async function runDemo(id:string){return (await api.post(`/api/demo/${id}`)).data}
