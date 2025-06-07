import axios from "axios";
import { EndpointData } from "@shared/types/EndpointData";

// Define your Upscope API key
const UPSCOPE_API_KEY = process.env.UPSCOPE_API_KEY || "your-upscope-api-key";

// Define the regions and their corresponding URLs
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
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${UPSCOPE_API_KEY}`,
          },
          timeout: 4000,
        });

        const data = response.data;

        results.push({
          region,
          status: "online",
          load: data.load ?? 0,
          stats: data,
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
          load: 0,
          stats: {},
        });
      }
    })
  );

  return results;
};
