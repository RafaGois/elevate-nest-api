import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { cleanDatabase, closeTestApp } from './helpers/clean-database';
import { createTestApp } from './helpers/create-app';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  const validUser = {
    name: 'Test User',
    email: 'auth-test@example.com',
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

  describe('POST /auth/signup', () => {
    it('creates a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(validUser)
        .expect(201);

      expect(response.body).toMatchObject({
        name: validUser.name,
        email: validUser.email,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body).not.toHaveProperty('password');
    });

    it('returns 401 when email already exists', async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(validUser);

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(validUser)
        .expect(401);

      expect(response.body.message).toBe('Usuário já existe');
    });

    it('returns 400 for invalid payload', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'invalid', password: '123' })
        .expect(400);
    });
  });

  describe('POST /auth/signin', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(validUser);
    });

    it('returns a token for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: validUser.email, password: validUser.password })
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
      expect(response.body.email).toBe(validUser.email);
    });

    it('returns 401 when user is not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'notfound@example.com', password: validUser.password })
        .expect(401);

      expect(response.body.message).toBe('Usuário não encontrado');
    });

    it('returns 401 when password is incorrect', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: validUser.email, password: 'wrongpassword1' })
        .expect(401);

      expect(response.body.message).toBe('Senha incorreta');
    });
  });
});
