import { ReactNode } from 'react'
import { explorer } from 'shared/util'

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

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  return window.notify({
    type: 'error',
    description: er.message,
  })
}

export const generateCsv = (data: Record<string, any>[]) => {
  const titles: string[] = []
  // generate title
  for (const elm of data) {
    for (const key in elm) {
      if (!titles.includes(key)) titles.push(key)
    }
  }
  // generate row data
  const csvData = [titles]
  for (const elm of data) {
    const rowData = []
    for (const title of titles) {
      const val = String(elm[title]) || ''
      rowData.push(val)
    }
    csvData.push(rowData)
  }
  return {
    data: csvData,
    download: () => {
      let csvContent =
        'data:text/csv;charset=utf-8,' +
        csvData.map((e) => e.join(',')).join('\n')

      var encodedUri = encodeURI(csvContent)
      var link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `sentre_cheques_${new Date().toString()}.csv`,
      )
      document.body.appendChild(link)
      link.click()
    },
  }
}
