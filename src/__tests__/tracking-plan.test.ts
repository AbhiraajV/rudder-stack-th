import request from 'supertest';
import { createAppServer } from '../server';
import { resetDatabase } from './helper';
import { prisma } from '../../prisma/prisma';
const app = createAppServer();
describe('POST /api/tracking-plan/create-by-object', () => {
  let apiKey: string;

  beforeAll(async () => {
    await resetDatabase();
      apiKey = "LjtmooBZekGnHubR8QTQPDuEQUR1g_iV";
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('should create a new tracking plan with nested events and properties', async () => {
    const res = await request(app)
      .post('/api/tracking-plan/create-by-object')
      .set('x-api-key', apiKey)
      .send({
        name: 'Sample Plan',
        description: 'A test plan',
        events: [
          {
            name: 'Signup',
            type: 'track',
            description: 'User signup',
            additionalProperties: false,
            properties: [
              {
                name: 'email',
                type: 'string',
                description: 'User email',
                required: true,
              },
              {
                name: 'plan',
                type: 'string',
                description: 'Chosen plan',
                required: false,
              },
            ],
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Sample Plan');
  });

  it('should return 400 if request body is invalid', async () => {
    const res = await request(app)
      .post('/api/tracking-plan/create-by-object')
      .set('x-api-key', apiKey)
      .send({}); // Missing required fields

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 409 if same event exists with a different description', async () => {
    // First insert
    await request(app)
      .post('/api/tracking-plan/create-by-object')
      .set('x-api-key', apiKey)
      .send({
        name: 'Conflict Plan',
        description: 'Plan with conflict',
        events: [
          {
            name: 'Login',
            type: 'track',
            description: 'User login', // original description
            additionalProperties: true,
            properties: [
              {
                name: 'device',
                type: 'string',
                description: 'Device used',
                required: true,
              },
            ],
          },
        ],
      });

    // Attempt conflicting insert
    const res = await request(app)
      .post('/api/tracking-plan/create-by-object')
      .set('x-api-key', apiKey)
      .send({
        name: 'Another Plan',
        description: 'Triggers conflict',
        events: [
          {
            name: 'Login',
            type: 'track',
            description: 'Conflicting description', // different from before
            additionalProperties: true,
            properties: [
              {
                name: 'device',
                type: 'string',
                description: 'Device used',
                required: true,
              },
            ],
          },
        ],
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already exists with a different description/i);
  });

  it('should return 409 if same property exists with different description', async () => {
    // First insert
    await request(app)
      .post('/api/tracking-plan/create-by-object')
      .set('x-api-key', apiKey)
      .send({
        name: 'Property Plan',
        description: 'Checks property',
        events: [
          {
            name: 'Purchase',
            type: 'track',
            description: 'User purchase',
            additionalProperties: false,
            properties: [
              {
                name: 'amount',
                type: 'number',
                description: 'Purchase amount',
                required: true,
              },
            ],
          },
        ],
      });

    // Try to reuse property with different description
    const res = await request(app)
      .post('/api/tracking-plan/create-by-object')
      .set('x-api-key', apiKey)
      .send({
        name: 'Conflicting Property Plan',
        description: 'Conflict on property desc',
        events: [
          {
            name: 'Refund',
            type: 'track',
            description: 'User refund',
            additionalProperties: false,
            properties: [
              {
                name: 'amount',
                type: 'number',
                description: 'Refund total', // <- conflicting
                required: true,
              },
            ],
          },
        ],
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/Property "amount".*different description/i);
  });

  it('should return 409 if same property is reused with different "required" flag', async () => {
    // First insert
    await request(app)
      .post('/api/tracking-plan/create-by-object')
      .set('x-api-key', apiKey)
      .send({
        name: 'Required Flag Plan',
        description: 'Plan with required true',
        events: [
          {
            name: 'Invite',
            type: 'track',
            description: 'Invite sent',
            additionalProperties: false,
            properties: [
              {
                name: 'email',
                type: 'string',
                description: 'Invitee email',
                required: true,
              },
            ],
          },
        ],
      });

    // Reuse property with required = false
    const res = await request(app)
      .post('/api/tracking-plan/create-by-object')
      .set('x-api-key', apiKey)
      .send({
        name: 'Required Conflict Plan',
        description: 'Different required flag',
        events: [
          {
            name: 'Invite Accepted',
            type: 'track',
            description: 'Invite accepted',
            additionalProperties: false,
            properties: [
              {
                name: 'email',
                type: 'string',
                description: 'Invitee email',
                required: false, // <- conflicting required flag
              },
            ],
          },
        ],
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/conflicting "required" values/i);
  });
});
