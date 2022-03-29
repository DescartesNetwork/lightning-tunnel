import { Button } from 'antd'
import { useAppRouter } from 'app/hooks/useAppRoute'

const ShareButton = ({ cid }: { cid: string }) => {
  const { appRoute, generateQuery } = useAppRouter()

  const onShare = () => {
    let url = 'http://twitter.com/intent/tweet?'
    const redeemLink = `${window.location.origin}${appRoute}?${generateQuery({
      redeem: cid,
    })}`
    const params: Record<string, string> = {
      url: redeemLink,
      text: 'Your prize has arrived! Redeem now at Sen Hub: ',
    }
    for (const prop in params)
      url += '&' + prop + '=' + encodeURIComponent(params[prop] || '')
    window.open(url, '_blank')
  }

  return (
    <Button onClick={onShare} type="text" style={{ color: '#42E6EB' }}>
      share
    </Button>
  )
}

export default ShareButton
