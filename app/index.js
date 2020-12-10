const handler = require('./lib/handler/lesson')

const telegramIniter = require('./lib/telegram/init')
const tg = telegramIniter.init()
handler.getNearLessons().then(l => {
  handler.notifyNearTeachers(l, tg)
})
