const User = require('../models/User')
const isEmail = require('isemail')

class UserController {
  async findAll (req, res) {
    const users = await User.find()
    return res.json(users)
  }

  async find (req, res) {
    const { id } = req.params

    const user = await User.findOne({ _id: id })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    return res.json(user)
  }

  async create (req, res) {
    const { email, passwd } = req.body

    const emailValidation = isEmail.validate(email)

    if (!emailValidation) {
      return res.status(404).json({ message: 'O padrão do E-mail está incorreto' })
    }

    const user = await User.findOne({ email })

    if (user) {
      return res.status(404).json({ message: 'Este e-mail já foi cadastrado em nosso sistema' })
    }

    const newUser = await User.create({ email, passwd })

    return res.json(newUser)
  }

  async delete (req, res) {
    const { id } = req.params

    await User.findByIdAndDelete({ _id: id })
      .then(data => {
        if (!data) {
          return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        return res.json({ message: 'Usuário removido com sucesso' })
      })
      .catch(error => {
        return res.status(404).json({ error: true, message: error })
      })
  }

  async update (req, res) {
    const { id } = req.params
    const { email, passwd } = req.body

    const updateQuery = {}

    if (email) {
      updateQuery.email = email
    }

    if (passwd) {
      updateQuery.passwd = passwd
    }

    await User.findByIdAndUpdate(id, updateQuery, { new: true })
      .then(data => {
        if (!data) {
          return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        return res.json(data)
      })
      .catch(error => {
        return res.status(404).json({ error: true, message: error })
      })
  }
}

module.exports = new UserController()
