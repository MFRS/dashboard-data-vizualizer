import request from "supertest";
import { app } from "../server";

describe("Express Server", () => {
  it("GET /health → should return 200 OK with correct message", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Server is up");
  });
});
