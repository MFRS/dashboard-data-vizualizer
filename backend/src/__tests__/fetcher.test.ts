jest.mock("axios", () => ({
  get: jest.fn(
    (url: string) =>
      url.includes("us-east")
        ? Promise.resolve({ data: { load: 0.3 } }) // Simulate a success
        : Promise.reject(new Error("Timeout")) // Simulate a failure
  ),
}));

import { fetchData } from "../fetcher";
import { server, broadcaster } from "../server";
import axios from "axios";



describe("fetchData", () => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // suppresses console errors in tests
  beforeAll((done) => {
    server.listen(8081, () => {
      broadcaster.start();
      done();
    });
  });

  afterAll((done) => {
    broadcaster.stop();
    server.close(done);
  });

  it("marks successful regions as online", async () => {
    const result = await fetchData();
    const usEast = result.find((r) => r.region === "us-east");

    expect(usEast).toBeDefined();
    expect(usEast?.status).toBe("online");
    expect(usEast?.stats).toHaveProperty("load");
  });

  it("marks failed regions as offline", async () => {
    const result = await fetchData();
    const failedRegions = result.filter((r) => r.region !== "us-east");

    expect(failedRegions.length).toBeGreaterThan(0);
    expect(failedRegions.every((r) => r.status === "offline")).toBe(true);
    expect(failedRegions.every((r) => typeof r.stats === "object")).toBe(true);
  });

  it("does not throw even if all endpoints fail", async () => {
    (axios.get as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error("Network error"))
    );

    const result = await fetchData();
    expect(result.every((r) => r.status === "offline")).toBe(true);
  });
});
