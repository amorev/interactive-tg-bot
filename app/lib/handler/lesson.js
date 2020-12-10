const fetcher = require('../api/fetcher')
const connector = require('../database/connector')
module.exports = {
  async getNearLessons () {
    const schedule = await fetcher.fetchSchedule()
    let date = new Date()
    date.setDate(date.getDate() + 1)
    const nearTime = date.toISOString()
    const currentTime = (new Date).toISOString()
    const nearLessons = schedule.schedule.filter(s => {
      return s.date < nearTime && s.date > currentTime
    })
    return nearLessons
  },
  async nearLessonsForMe (telegramId, tg) {
    const teacherId = await connector.getTeacherIdByTelegramId(telegramId)
    const nearLessons = await this.getNearLessons()
    const myLessons = nearLessons.filter(e => {
      let b = e.teachers.findIndex(a => a.id === teacherId) !== -1
      return b
    })
    return myLessons
  },
  async notifyNearTeachers (nearLessons, tg, teacherIds) {
    teacherIds = teacherIds || []
    const teachersIds = nearLessons.map(nl => nl.teachers.map(t => t.id))
    const resultTeacherIds = {}
    teachersIds.forEach(t => {
      t.forEach(a => {
        if (!resultTeacherIds[a]) {
            resultTeacherIds[a] = a
        }
      })
    })
    const telegramIds = await Promise.all(Object.keys(resultTeacherIds).map(async teacherId => {
      const rows = await connector.getTelegramIdByTeacherId(teacherId)
      if (rows[0])
        return rows[0].telegram_id
      return null
    }))

    telegramIds.forEach(tId => {
      tg.onMaster(() => {
        console.log(tg.sendMessage)
        tg.api.sendMessage(tId, 'lesson is soon')
      })
    })
  }
}
