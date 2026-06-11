import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { cleanDatabase, closeTestApp } from './helpers/clean-database';
import { createTestApp } from './helpers/create-app';

describe('User (e2e)', () => {
  let app: INestApplication<App>;

  const validUser = {
    name: 'Test User',
    email: 'user-test@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await cleanDatabase(app);
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /users', () => {
    it('returns an empty list when there are no users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('returns all users', async () => {
      const signupResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(validUser)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: signupResponse.body.id,
        name: validUser.name,
        email: validUser.email,
      });
    });
  });

  describe('GET /users/:id', () => {
    it('returns a user by id', async () => {
      const signupResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(validUser)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/users/${signupResponse.body.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: signupResponse.body.id,
        name: validUser.name,
        email: validUser.email,
      });
    });

    it('returns empty response when user is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(200);

      expect(response.body).not.toHaveProperty('id');
    });
  });
});
