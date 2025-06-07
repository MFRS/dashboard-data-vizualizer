import { fetchData } from "../fetcher";
import { app, server, broadcaster } from "../server";

beforeAll((done) => {
  server.listen(8081, () => {
    broadcaster.start();
    done();
  });
});


jest.mock("axios", () => ({
  get: jest.fn((url) =>
    url.includes("us-east")
      ? Promise.resolve({ data: { load: 0.3 } })
      : Promise.reject("fail")
  ),
}));

describe("fetchData", () => {
  it("returns status for all regions, marks failed ones offline", async () => {
    const result = await fetchData();
    const usEast = result.find((r) => r.region === "us-east");
    const others = result.filter((r) => r.region !== "us-east");

    expect(usEast?.status).toBe("online");
    expect(others.every((r) => r.status === "offline")).toBe(true);
  });
});

afterAll((done) => {
  broadcaster.stop();
  server.close(done); //  stop HTTP server
});
