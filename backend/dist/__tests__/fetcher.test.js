"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("axios", () => ({
    get: jest.fn((url) => url.includes("us-east")
        ? Promise.resolve({ data: { load: 0.3 } }) // Simulate a success
        : Promise.reject(new Error("Timeout")) // Simulate a failure
    ),
}));
const fetcher_1 = require("../fetcher");
const server_1 = require("../server");
const axios_1 = __importDefault(require("axios"));
describe("fetchData", () => {
    jest.spyOn(console, "error").mockImplementation(() => { }); // suppresses console errors in tests
    beforeAll((done) => {
        server_1.server.listen(8081, () => {
            server_1.broadcaster.start();
            done();
        });
    });
    afterAll((done) => {
        server_1.broadcaster.stop();
        server_1.server.close(done);
    });
    it("marks successful regions as online", async () => {
        const result = await (0, fetcher_1.fetchData)();
        const usEast = result.find((r) => r.region === "us-east");
        expect(usEast).toBeDefined();
        expect(usEast?.status).toBe("online");
        expect(usEast?.stats).toHaveProperty("load");
    });
    it("marks failed regions as offline", async () => {
        const result = await (0, fetcher_1.fetchData)();
        const failedRegions = result.filter((r) => r.region !== "us-east");
        expect(failedRegions.length).toBeGreaterThan(0);
        expect(failedRegions.every((r) => r.status === "offline")).toBe(true);
        expect(failedRegions.every((r) => typeof r.stats === "object")).toBe(true);
    });
    it("does not throw even if all endpoints fail", async () => {
        axios_1.default.get.mockImplementation(() => Promise.reject(new Error("Network error")));
        const result = await (0, fetcher_1.fetchData)();
        expect(result.every((r) => r.status === "offline")).toBe(true);
    });
});
