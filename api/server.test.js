const request = require('supertest')
const server = require('./server');
const db = require('../data/dbConfig');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

// beforeEach(async () => {
//   await db.seed.run()
// })

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register', () => {
  test('adds a user to db', async () => {
      await request(server)
          .post('/api/auth/register')
          .send({ username: 'joey', password: 'dsfbdsjhifbdhjufbe' })

      const user = await db('users')

      expect(user).toHaveLength(1)
  }, 600)

  test('Expect register to respond with newly created user', async () => {
      const res = await request(server)
          .post('/api/auth/register')
          .send({ username: "jordan", password: 'hash' })
      expect(res.body).toHaveProperty('username', 'jordan')
      expect(res.body).toHaveProperty('password')
  })
})

describe('[POST] /api/auth/login', () => {
  test('Responds with token and username', async () => {
      await request(server)
          .post('/api/auth/register')
          .send({ username: 'boop', password: 'grjkbngkjfdsng' })

      const res = await request(server)
          .post('/api/auth/login')
          .send({ username: 'boop', password: 'grjkbngkjfdsng' })

      expect(res.body).toHaveProperty('message', 'welcome, boop')
      expect(res.body).toHaveProperty('token')
  }, 600)

  test('proper error message sent back with wrong credentials', async () => {
      await request(server)
          .post('/api/auth/register')
          .send({ username: "testing", password: 'testtoo' })

      const res = await request(server)
          .post('/api/auth/login')
          .send({ username: "testing", password: 'testto' })

      expect(res.body).toHaveProperty('message', 'Invalid credentials')
  })
})

describe('[GET] /api/jokes', () => {
  test('Responds with proper error message when trying to access without token', async () => {
      const res = await request(server)
          .get('/api/jokes')
          .send()

      expect(res.body).toHaveProperty('message', 'token required')
  }, 600)

  test('Sends back correct error message when sent an invalid token', async () => {
      const res = await request(server)
        .get('/api/jokes')
        .set('Authorization', 'Bearer ' + 'jsdajhbfdshjbf')

      expect(res.body).toHaveProperty('message', 'token invalid')
  })
})
