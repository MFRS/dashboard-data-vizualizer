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

  await Promise.all(
    endpoints.map(async ({ region, url }) => {
      try {
        const response = await axios.get(url, { timeout: 4000 });
        results.push({
          region,
          status: "online",
          stats: response.data,
        });
      } catch (error: unknown) {
           if (error instanceof Error) {
             console.error(` ${region} fetch failed:`, error.message);
           } else {
             console.error(` ${region} fetch failed with non-Error:`, error);
           }
        results.push({
          region,
          status: "offline",
          stats: {},
        });
      }
    })
  );

  return results;
};
