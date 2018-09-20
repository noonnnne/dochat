import { Emoji2Word } from '../components/emoji/index'

export default function generateNotification(data) {
  if (window.Notification) {
    const popNotice = () => {
      if (Notification.permission === 'granted') {
        const message = data.type === 'file' ? '[文件]' : data.content
        console.log(Emoji2Word(message))
        // eslint-disable-next-line
        new Notification('收到了一条消息', {
          body: Emoji2Word(message),
          icon: data.from.avatar
        })
      }
    }

    if (Notification.permission === 'granted') {
      popNotice()
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(() => {
        popNotice()
      })
    }
  }
}
