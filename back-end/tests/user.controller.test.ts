import request from "supertest";
import app from "../src/app";

describe("GET /api/users", () => {
  it("should return a list of users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
  });
});
