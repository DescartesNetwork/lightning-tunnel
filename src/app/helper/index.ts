import { ReactNode } from 'react'

type GmailMessage = {
  from: string
  to: string[]
  subject: string
  message: string | ReactNode
}

export const onSendMessage = async (args: GmailMessage) => {
  const { from, to, subject, message } = args
  const msg =
    `From: ${from}\r\n` +
    `To: ${to.toString()}\r\n` +
    'Content-Type: text/html; charset=utf-8\r\n' +
    `Subject: ${subject}\r\n\r\n` +
    message

  // The body needs to be base64url encoded.
  const encodedMessage = window.btoa(msg)

  const reallyEncodedMessage = encodedMessage
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  const rsSendMsg = await window.gapi.client.gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: reallyEncodedMessage,
    },
  })
  return rsSendMsg
}
