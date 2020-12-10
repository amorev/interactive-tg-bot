const fetcher = require('../api/fetcher')
const connector = require('../database/connector')

module.exports = {
  async findTeacherByName (name) {
    const schedule = await fetcher.fetchSchedule()
    const teachers = schedule.schedule.map(s => {
      return s.teachers
    })
    let foundTeacher = null
    teachers.forEach(teacherCollection => {
      teacherCollection.forEach(teacher => {
        if (teacher.fullname === name) {
          foundTeacher = teacher
        }
      })
    })
    return foundTeacher
  },
  async connectTeacherIdAndTelegramId(teacherId, telegramId) {
    return connector.connectTelegramIdWithTeacherId(telegramId, teacherId)
  }
}
