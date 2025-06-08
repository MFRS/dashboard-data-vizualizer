"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const supertest_1 = __importDefault(require("supertest"));
beforeAll((done) => {
    server_1.server.listen(8081, () => {
        server_1.broadcaster.start();
        done();
    });
});
test("GET /health should return OK", async () => {
    const res = await (0, supertest_1.default)(server_1.app).get("/health");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Server is up");
});
afterAll((done) => {
    server_1.broadcaster.stop();
    server_1.server.close(done);
});
