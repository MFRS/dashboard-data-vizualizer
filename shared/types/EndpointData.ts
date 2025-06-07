export interface EndpointData {
  region: string;
  status: string;
  load: number;
  stats: Record<string, any>;
}
