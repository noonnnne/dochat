export default{
  methods: {
    getDateFromStamp(stamp) {
      const date = stamp ? new Date(stamp) : new Date()
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        day: date.getDay(),
        hour: date.getHours(),
        minute: date.getMinutes()
      }
    },
    
    getFormatTime(stamp) {
      const formatTime = this.getDateFromStamp(stamp)
      return `${formatTime.year}-${formatTime.month}-${formatTime.day} ${formatTime.hour}-${formatTime.minute}`
    }
  }
}
