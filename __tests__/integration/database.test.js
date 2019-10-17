const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')

describe('database connection', () => {
  let connection
  let db

  beforeAll(async () => {
    dotenv.config()

    connection = await MongoClient.connect(
      process.env.DB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )

    db = await connection.db(process.env.DB_NAME)
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should be able to connect to the database', () => {
    expect(connection.isConnected()).toBe(true)
  })
})
