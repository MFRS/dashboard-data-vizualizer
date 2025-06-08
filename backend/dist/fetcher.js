"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchData = void 0;
const axios_1 = __importDefault(require("axios"));
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
const fetchData = async () => {
    const results = [];
    await Promise.all(endpoints.map(async ({ region, url }) => {
        try {
            const response = await axios_1.default.get(url, { timeout: 4000 });
            const data = response.data;
            results.push({
                region,
                status: "online",
                load: data.results.stats.server.cpu_load ?? 0,
                stats: data.results.stats,
                services: data.results.services,
                version: data.version,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(` ${region} fetch failed:`, error.message);
            }
            else {
                console.error(` ${region} fetch failed with non-Error:`, error);
            }
            results.push({
                region,
                status: "offline",
                load: 0,
                stats: {
                    servers_count: 0,
                    online: 0,
                    session: 0,
                    server: {
                        cpus: 0,
                        active_connections: 0,
                        wait_time: 0,
                        workers: [],
                        cpu_load: 0,
                        timers: 0,
                    },
                },
                services: {
                    redis: false,
                    database: false,
                },
                version: "unknown",
            });
        }
    }));
    return results;
};
exports.fetchData = fetchData;
