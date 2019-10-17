const app = require('../../src/app')
const agent = require('supertest').agent(app)

const defaultUser = {
  email: 'admin@alive.com',
  passwd: '@dm!n124$4ev3r!0n3>'
}

let cookie
let tempId
let tempEmail
let tempPasswd

describe('users tests', () => {
  beforeAll(() => agent
    .post('/login')
    .send(defaultUser)
    .expect(200)
    .then((res) => {
      const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
      cookie = cookies.join(';')
    }))

  afterAll(async () => {
    await connection.close()
  })

  describe('Single auth user test', () => {
    it('should get greetings message after user logged on', () => agent
      .get('/api')
      .expect(200)
      .expect(res => {
        res.body.message = 'Dashboard!!!'
      })
    )
  })

  describe('POST tests', () => {
    it('should not be able to register a user by wrong email pattern', () => agent
      .post('/api/users')
      .send({
        email: 'wrongmail',
        passwd: '123'
      })
      .expect(res => {
        res.body.message = 'O padrão do E-mail está incorreto'
      })
    )

    it('should not be able to register a user by email already registered', () => agent
      .post('/api/users')
      .send(defaultUser)
      .expect(res => {
        res.body.message = 'Este e-mail já foi cadastrado em nosso sistema'
      })
    )

    it('should be able to register a new user', () => agent
      .post('/api/users')
      .send({
        email: 'rogerio@alive.com',
        passwd: '1234@kduhehw$'
      })
      .expect(res => {
        tempId = res.body._id
        tempEmail = res.body.email
        tempPasswd = res.body.passwd
      })
    )
  })

  describe('GET tests', () => {
    it('should not be able to get specific user by wrong id', () => agent
      .get('/api/users/999999999999999999999999')
      .expect(404)
      .expect(res => {
        res.body.message = 'Usuário não encontrado'
      })
    )

    it('should be able to get specific user by id', () => agent
      .get(`/api/users/${tempId}`)
      .expect(200)
      .expect(res => {
        res.body._id = tempId
      })
    )

    it('should be able to get all users', () => agent
      .get('/api/users')
      .expect(200)
    )
  })

  describe('UPDATE tests', () => {
    it('should not be able to update a user by wrong _id', () => agent
      .put('/api/users/999999999999999999999999')
      .expect(404)
      .send({
        email: '',
        passwd: ''
      })
      .expect(res => {
        res.body.message = 'Usuário não encontrado'
      })
    )

    it('should not be able to delete a user by mongodb error', () => agent
      .put('/api/users/XXXX')
      .send({
        email: '',
        passwd: ''
      })
      .expect(404)
      .expect(res => {
        res.body.error = true
      })
    )

    it('should be able to update a user passwd', () => agent
      .put(`/api/users/${tempId}`)
      .send({
        email: tempEmail,
        passwd: 'newP@sswd$'
      })
      .expect(200)
      .expect(res => {
        res.body._id = tempId
      })
    )

    it('should be able to update a user email', () => agent
      .put(`/api/users/${tempId}`)
      .send({
        email: 'new-mail@gmail.com',
        passwd: 'newP@sswd$'
      })
      .expect(200)
      .expect(res => {
        res.body._id = tempId
        res.body.message = 'Usuário atualizado com sucesso'
      })
    )
  })

  describe('DELETE tests', () => {
    it('should not be able to delete a user by mongodb error', () => agent
      .delete('/api/users/XXXX')
      .expect(404)
      .expect(res => {
        res.body.error = true
      })
    )

    it('should not be able to delete a user by wrong _id', () => agent
      .delete('/api/users/999999999999999999999999')
      .expect(404)
      .expect(res => {
        res.body.message = 'Usuário não encontrado'
      })
    )

    it('should be able to delete a user by id', () => agent
      .delete(`/api/users/${tempId}`)
      .expect(200)
      .expect(res => {
        res.body.message = 'Usuário removido com sucesso'
      })
    )
  })
})
