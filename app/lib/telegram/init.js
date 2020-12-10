const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const teacherHandler = require('../handler/teacher')
const lessonHandler = require('../handler/lesson')

class HelloController extends TelegramBaseController {
  handle ($) {
    const form = {
      name: {
        q: 'Напишите ваши фамилию и имя',
        error: "Вы не ввели имя",
        validator: (message, cb) => {
          if (message.text) {
            cb(true, message.text)
            return
          }
          cb(false)
        }
      }
    }
    $.runForm(form, async (result) => {
      const teacher = await teacherHandler.findTeacherByName(result.name)
      if (teacher) {
        $.runMenu({
          message: "Вы " + teacher.fullname + " с ID: " + teacher.id + "?",
          'Да': () => {
            return teacherHandler.connectTeacherIdAndTelegramId(teacher.id, $.chatId)
          },
          'Нет': {

          }
        })
      }
      console.log(teacher)
    })
  }
}

class TomorrowLessons extends TelegramBaseController {
  async handle ($) {
    const telegramId = $.chatId
    const nearLessons = await lessonHandler.nearLessonsForMe(telegramId, $)
    let message = nearLessons.map(lesson => {
      return 'Урок: ' + lesson.title + '\n' +
        'Дата: ' + lesson.date
    }).join('\n')
    if (!message) {
      message =
        'Уроков завтра не планируется'
    }
    $.sendMessage(message)
  }
}

module.exports = {
  init () {
    const tg = new Telegram.Telegram(process.env.TELEGRAM_BOT_TOKEN, {
      workers: 1
    })

    tg.router
      .when(
        new TextCommand('start'),
        new HelloController
      )
      .when(
        new TextCommand('tomorrow'),
        new TomorrowLessons
      )

    return tg
  }
}


