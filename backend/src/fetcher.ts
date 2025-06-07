import axios from "axios";
import { EndpointData } from "./types";

const endpoints = [
  { region: "us-east", url: "https://data--us-east.upscope.io/status?stats=1" },
  { region: "eu-west", url: "https://data--eu-west.upscope.io/status?stats=1" },
  {
    region: "eu-central",
    url: "https://data--eu-central.upscope.io/status?stats=1",
  },
  { region: "us-west", url: "https://data--us-west.upscope.io/status?stats=1" },
  { region: "sa-east", url: "https://data--sa-east.upscope.io/status?stats=1" },
  {
    region: "ap-southeast",
    url: "https://data--ap-southeast.upscope.io/status?stats=1",
  },
];

export const fetchData = async (): Promise<EndpointData[]> => {
  const results: EndpointData[] = [];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url, { timeout: 5000 });
      results.push({
        region: endpoint.region,
        status: "online",
        stats: response.data,
      });
    } catch (error) {
      results.push({
        region: endpoint.region,
        status: "offline",
        stats: {},
      });
    }
  }

  return results;
};
