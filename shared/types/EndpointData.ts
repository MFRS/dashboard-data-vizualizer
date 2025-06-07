export interface EndpointData {
  region: string;
  status: "online" | "offline";
  load?: number;
}
