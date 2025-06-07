import { app, server, broadcaster } from "../server";
import request from "supertest";

beforeAll((done) => {
  server.listen(8081, () => {
    broadcaster.start();
    done();
  });
});


test("GET /health should return OK", async () => {
  const res = await request(app).get("/health");
  expect(res.status).toBe(200);
  expect(res.text).toBe("Server is up");
});

afterAll((done) => {
  broadcaster.stop();
  server.close(done);
});
