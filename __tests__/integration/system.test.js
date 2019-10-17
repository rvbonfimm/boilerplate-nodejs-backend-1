const request = require('supertest')
const app = require('../../src/app')
const agent = request.agent(app)

const defaultUser = {
  email: 'admin@alive.com',
  passwd: '@dm!n124$4ev3r!0n3>'
}

describe('system tests', () => {
  afterAll(async () => {
    await connection.close()
    agent.close()
  })

  it('should get greetings message from root route', async () => {
    const response = await request(app)
      .get('/')

    expect(response.body).toMatchObject({
      message: 'Hello, world!!!'
    })
  })

  it('should not be able to get the auth needed routes by user not logged on', async () => {
    const response = await request(app)
      .get('/api/users')

    expect(response.status).toBe(302)
  })

  it('should not be able to log in the system', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@alive.commm',
        passwd: 'passw0oo0r3d'
      })

    expect(response.body).toMatchObject({
      message: 'User not found'
    })
  })

  it('should be able to log in the system', async () => {
    const response = await request(app)
      .post('/login')
      .send(defaultUser)

    expect(response.body).toMatchObject({
      message: 'User logged on'
    })
  })

  it('should be able to log out of the system', async () => {
    const response = await request(app)
      .get('/logout')

    expect(response.status).toBe(302)
  })
})
