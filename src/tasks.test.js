const request = require('supertest');
const app = require('./server');

async function getToken() {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password123' });
  return res.body.token;
}

describe('Auth', () => {
  it('rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('issues a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('Tasks API', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  it('creates, reads, updates, and deletes a task', async () => {
    const token = await getToken();
    const auth = { Authorization: `Bearer ${token}` };

    const createRes = await request(app)
      .post('/api/tasks')
      .set(auth)
      .send({ title: 'Test task', description: 'desc' });
    expect(createRes.status).toBe(201);
    const taskId = createRes.body.id;

    const listRes = await request(app).get('/api/tasks').set(auth);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.some((t) => t.id === taskId)).toBe(true);

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set(auth)
      .send({ completed: true });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.completed).toBe(true);

    const deleteRes = await request(app).delete(`/api/tasks/${taskId}`).set(auth);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/tasks/${taskId}`).set(auth);
    expect(getRes.status).toBe(404);
  });

  it('rejects task creation with empty title', async () => {
    const token = await getToken();
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '   ' });
    expect(res.status).toBe(400);
  });

  it('returns 404 for updating a non-existent task', async () => {
    const token = await getToken();
    const res = await request(app)
      .put('/api/tasks/nonexistent-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New title' });
    expect(res.status).toBe(404);
  });
});
