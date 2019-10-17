const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    passwd: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', schema)
