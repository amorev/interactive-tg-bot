const mockData = require('./mock.json')

module.exports = {
  async fetchSchedule () {
    return Promise.resolve(mockData)
  }
}
