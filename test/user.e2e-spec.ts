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

  async function getAuthToken(): Promise<string> {
    await request(app.getHttpServer()).post('/auth/signup').send(validUser);

    const signinResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: validUser.email, password: validUser.password });

    return signinResponse.body.token;
  }

  describe('GET /users', () => {
    it('returns users for authenticated requests', async () => {
      const token = await getAuthToken();

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        name: validUser.name,
        email: validUser.email,
      });
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('returns all users without password', async () => {
      const token = await getAuthToken();

      const signupResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Another User',
          email: 'another@example.com',
          password: 'password123',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        name: validUser.name,
        email: validUser.email,
      });
      expect(response.body[1]).toMatchObject({
        id: signupResponse.body.id,
        name: 'Another User',
        email: 'another@example.com',
      });
      response.body.forEach((user: Record<string, unknown>) => {
        expect(user).not.toHaveProperty('password');
      });
    });
  });

  describe('GET /users/:id', () => {
    it('returns a user by id without password', async () => {
      const token = await getAuthToken();

      const usersResponse = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get(`/users/${usersResponse.body[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: usersResponse.body[0].id,
        name: validUser.name,
        email: validUser.email,
      });
      expect(response.body).not.toHaveProperty('password');
    });

    it('returns empty response when user is not found', async () => {
      const token = await getAuthToken();

      const response = await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).not.toHaveProperty('id');
    });
  });
});
