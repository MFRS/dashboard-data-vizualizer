import type { EndpointData } from "dashboard-shared-types/types/EndpointData";

export interface HistoricalData extends EndpointData {
  cpuHistory?: number[];
}
