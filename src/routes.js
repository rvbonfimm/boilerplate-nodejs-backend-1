const express = require('express')
const routes = express.Router()

const AuthMiddleware = require('./application/middlewares/Auth')
const SystemController = require('./application/controllers/SystemController')
const UserController = require('./application/controllers/UserController')

routes.get('/', SystemController.index)
routes.get('/logout', SystemController.logout)
routes.post('/login', SystemController.login)

routes.use(AuthMiddleware)

routes.get('/api', SystemController.dashboard)

routes.get('/api/users', UserController.findAll)
routes.get('/api/users/:id', UserController.find)
routes.post('/api/users', UserController.create)
routes.delete('/api/users/:id', UserController.delete)
routes.put('/api/users/:id', UserController.update)

module.exports = routes
