import supertest from "supertest";
import { resetDatabase } from "./helper";
import { createAppServer } from "../server";
import { prisma } from "../../prisma/prisma";
const apiKey = 'LjtmooBZekGnHubR8QTQPDuEQUR1g_iV'
const app = createAppServer();
describe('Event API', () => {
  let createdEventId: string;

  beforeAll(async () => {
    await resetDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();

    const res = await supertest(app)
      .post('/api/events')
      .set('x-api-key', apiKey)
      .send({
        name: 'user_signed_up',
        description: 'Fires when user signs up',
        type: 'track',
      });

    createdEventId = res.body.id;
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('POST /api/events - should create an event', async () => {
    // No need to test again here; covered in beforeEach, but optional:
    const res = await supertest(app)
      .post('/api/events')
      .set('x-api-key', apiKey)
      .send({
        name: 'user_logged_in',
        description: 'Fires when user logs in',
        type: 'track',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('GET /api/events/:id - should fetch the created event', async () => {
    const res = await supertest(app)
      .get(`/api/events/${createdEventId}`)
      .set('x-api-key', apiKey);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdEventId);
  });

  it('GET /api/events - should list events', async () => {
    const res = await supertest(app)
      .get('/api/events')
      .set('x-api-key', apiKey);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /api/events/:id - should delete the event', async () => {
    const res = await supertest(app)
      .delete(`/api/events/${createdEventId}`)
      .set('x-api-key', apiKey);

    expect(res.status).toBe(204);
  });
});
