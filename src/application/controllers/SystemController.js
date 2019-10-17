const User = require('../models/User')

class SystemController {
  index (req, res) {
    return res.json({ message: 'Hello, world!!!' })
  }

  dashboard (req, res) {
    return res.json({ message: 'Dashboard!!!' })
  }

  async login (req, res) {
    const { email, passwd } = req.body

    const user = await User.findOne({ email, passwd })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    req.session.user = user

    return res.json({ message: 'User logged on' })
  }

  logout (req, res) {
    req.session.destroy(() => {
      res.clearCookie(process.env.SESSION_NAME)
      return res.redirect('/')
    })
  }
}

module.exports = new SystemController()
