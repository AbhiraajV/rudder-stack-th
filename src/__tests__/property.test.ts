import supertest from "supertest";
import { createAppServer } from "../server";
import { resetDatabase } from "./helper";

const app = createAppServer();
const request = supertest(app);
const API_KEY = "LjtmooBZekGnHubR8QTQPDuEQUR1g_iV";

describe("Property API", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe("POST /api/property", () => {
    it("should create a property", async () => {
      const res = await request
        .post("/api/property")
        .set("x-api-key", API_KEY)
        .send({
          name: "test_property",
          type: "string",
          description: "Test property",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe("test_property");
    });

    it("should not allow duplicate property name", async () => {
      await request
        .post("/api/property")
        .set("x-api-key", API_KEY)
        .send({
          name: "duplicate",
          type: "string",
          description: "duplicate",
        });

      const res = await request
        .post("/api/property")
        .set("x-api-key", API_KEY)
        .send({
          name: "duplicate",
          type: "string",
          description: "duplicate again",
        });

      expect(res.status).toBe(409);
    });

    it("should return 400 for missing name/type", async () => {
      const res = await request
        .post("/api/property")
        .set("x-api-key", API_KEY)
        .send({ description: "no name/type" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/property", () => {
    it("should return an empty list initially", async () => {
      const res = await request.get("/api/property").set("x-api-key", API_KEY);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all created properties", async () => {
      await request.post("/api/property").set("x-api-key", API_KEY).send({
        name: "prop1",
        type: "string",
        description: "some description",
      });

      await request.post("/api/property").set("x-api-key", API_KEY).send({
        name: "prop2",
        type: "number",
        description: "another description",
      });

      const res = await request.get("/api/property").set("x-api-key", API_KEY);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("PUT /api/property/:id", () => {
    it("should update a property", async () => {
      const created = await request.post("/api/property").set("x-api-key", API_KEY).send({
        name: "to-update",
        type: "boolean",
        description: "old desc",
      });

      const res = await request
        .put(`/api/property/${created.body.id}`)
        .set("x-api-key", API_KEY)
        .send({ name: "updated", description: "new description" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("updated");
      expect(res.body.description).toBe("new description");
    });

    it("should return 404 for non-existent ID", async () => {
      const res = await request
        .put("/api/property/99999999")
        .set("x-api-key", API_KEY)
        .send({ name: "anything" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/property/:id", () => {
    it("should delete a property", async () => {
      const created = await request.post("/api/property").set("x-api-key", API_KEY).send({
        name: "to-delete",
        type: "boolean",
        description: "desc",
      });

      const res = await request
        .delete(`/api/property/${created.body.id}`)
        .set("x-api-key", API_KEY);

      expect(res.status).toBe(204);

      const check = await request
        .get("/api/property")
        .set("x-api-key", API_KEY);

      const stillThere = check.body.find((p: any) => p.id === created.body.id);
      expect(stillThere).toBeUndefined();
    });

    it("should return 404 for invalid ID", async () => {
      const res = await request
        .delete("/api/property/123456")
        .set("x-api-key", API_KEY);

      expect(res.status).toBe(404);
    });
  });
});
