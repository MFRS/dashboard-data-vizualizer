export interface EndpointData {
  region: string;
  status: "online" | "offline";
  stats: Record<string, any>;
}
