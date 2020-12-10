const { Client } = require('pg')

const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'database',
  password: 'S3RooTPass123',
  port: 5432,
})
client.connect()

module.exports = {
  async getTelegramIdByTeacherId (teacherId) {
    const res = await client.query('SELECT telegram_id from telegram_id_teacher_connection where teacher_id = $1', [teacherId])
    return res.rows
  },
  async getTeacherIdByTelegramId (telegramId) {
    const res = await client.query('SELECT teacher_id from telegram_id_teacher_connection where telegram_id = $1', [telegramId])
    if (res.rows.length > 0) {
      return res.rows[0].teacher_id
    }
    return null
  },
  async connectTelegramIdWithTeacherId (telegramId, teacherId) {
    const res = await client.query('INSERT INTO telegram_id_teacher_connection (telegram_id, teacher_id) values ($1, $2)', [telegramId, teacherId])
    return res
  }
}
