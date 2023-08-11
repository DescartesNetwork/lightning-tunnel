import axios from 'axios'
import { decode, encode } from 'bs58'

const NULL = Buffer.from('00', 'hex')
const EXTENSION_LENGTH = 4
const CONTENT_LENGTH = 28

const decodeExtension = (cid: string) => {
  const buf = decode(cid)
  let ext = Buffer.from(
    buf.subarray(CONTENT_LENGTH, CONTENT_LENGTH + EXTENSION_LENGTH),
  ).toString('utf8')
  while (ext[0] === NULL.toString('utf8')) ext = ext.substring(1)
  return ext
}

export const toFilename = (cid: string) => {
  const extension = decodeExtension(cid)
  const content = Buffer.from(decode(cid).subarray(0, CONTENT_LENGTH))
  return `${encode(content)}.${extension}`
}

export const uploadFileToAws = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await axios.post(
    'https://api.sentre.io/storage/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    },
  )
  return data.cid
}

type DistributorAddress = string
export const MetadataBackup: Record<DistributorAddress, string> = {
  Hrn5D4pH4HFcKd747ScN8yCpd3dz6EBqAhfQmXpkqGxy:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  Cmt2nLjaM7nLNGZs2wcAJMfFum4D2PM33TwKPEQKNE1J:
    'ABbBcJot6XqnXZb7zYZZTzGigGVzrNzVE9GKXFmrMvpj',
  '8n8A7bgr6sHL1otp6kGgCQG3Xp5Yzoi35a76pKWfvyHg':
    'CPXLk4MB3g33zJeACutBmGRb6pKSMZhp5kcePbf9DsNB',
  '7wRiB8igG5jRgbfzPj1zE5hhZbBuZbVdsR5NC2Gtx9Qb':
    '21jcUMNiKaaFNq3eDo4nySD54vUDf6XAUZVUBmwuZJTm',
  '6uVVZyqqeKQkRnN4jQQdQRkSwKbazREL6qLhAyhdJtai':
    '41LSqWQJvDWPRv9nyicp53wtqxNF3LTevJWjqkE6wVyu',
  '7A5ARhScj8jzAPTW3BxC9KZ4EvKpPw56JhnQRe3Mi28m':
    'EP1yMZuf6N1opbxGiSwVhB9JjqZXernjCLYn14Z16KsH',
  '6R1Ps8fpcyKitPXSRLC6LEwxQD55xhsQdhm5fo7vuyUL':
    'J1NvTcq7aovJ8AHGPxrtyy9tYqtjxhyE46DfXgqPdKd5',
  HxnkontNKgkiqfEjBBAwGhNUzxT1kbo1wnist9uXF2yt:
    '2dEJAyqPMGk9SUCjqof9wQUcGz86aAi8U28NugxQqcVZ',
  '5cRUUtNPQCnes37zi3sPNMiXtWc3ZJXEM5HeHApdJfke':
    '6PXf86RUfdfdjJ8nnrpaTHXAip8x7QYuiudYFJMFsTFq',
  D4j54XeBo9RroPNyaof5mNRHm8tYYxjyxvqCETFweNLt:
    'GKyF9ELprcGR7mDunmNakxhGAStNAfJrnFkDj1Sccu4o',
  Gh8qs65djXDEFWdd4mwFL9V9wU4fm9MqRv7GWzvSebff:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  E1WXUW7NdvFp8FiAB7svQXMBQpmGigrkXu1JGyUSdeKJ:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  C76FwoBhiYUw7Xyy4RAg64AsfgnwEMkRspaKkFJ3WoVD:
    '4cEK5fgbUhQYGRSd7SoVtkbh64mKuPrjGUYdrsf25Lnf',
  G8cvHPc3gpePJTWW8TGLazQetWADsGEq3AJ811mQg3yY:
    '4cUqkWEo7qHobMJNa5fZnqXVG2GNELWymGwfMVF4BkgK',
  '4G2oqkfLQRG4krwxs62Hg8qfwwBXhQYwE9Y8X3PLNkVq':
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  Fni4hsJhNbmR5SPzAEwWhAheitMUXwkgzuxaYJqBwj6v:
    'ANoMdKCu9AWaHZsqdzMYB6YF1LwVyZeQ34Ljb4jHps5m',
  D6s2qUWxsQLStLi9C2H1WmDHaWzxi4YUDynZv843rx6U:
    'HRsTCgQPmGB4QdYWXM8tfxS6eA83zfeHbBQz6GeJ6iGK',
  HpEjDzeWCq7246LixtHuHo7xShcRVj4FUg9bXBpXyUg7:
    'aZC13AZobk4U5JT6t4CrjnCPws7WF2xBLhLq5XStMwZ',
  '4CveZuhUGPVdw3HcJ1mmjzhucesy8xjneb5u2DDojPi5':
    'AyK7trE4i566MottykPRGoNox4wuB1cRfM86ucuXvMFH',
  A5kSXq4NtvN2xqZmEojCmit7ex3s1SgZZtfRZz2ywjt:
    'Aw2okzwhXpTYQck9bQ2t2kLjoU9755ZvNKo3PoGZXXCo',
  '582ky9unMMM8Lc8uHKYaepRJqtchcTaRgZspPfGygnQi':
    'rSjzByxGE391hdcce4KQUoEYXsj68R3kfoU2Fydq8pK',
  CboRSes5dccLoJ52UarvC2ECoLaBeSLsD1WiYK7PxdEw:
    'BoU9a5MSSkEkk3xT7seWgBmS8rygdCR7ZnxHvyoTQyK9',
  DAD9gJrMnzaHSDv53x9v4cC9PXdZWQMGxZLy79TbgxCz:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  '7sQJ452teHaPMHCHJvsAuLtDroMroom86oa2s4J2ftQ':
    'GxFDYhWfjUk28NwZ5JQF2Sj8UzNpM9rHNwkGLAFZb5zj',
  '49bNtndoGunDXERTjzyHDkVYcWoUBsAgUGfEFVXyX7zJ':
    'mxKrsRbuPQiC3zYoYpQKUCfhH9JhbrkJ9DMJdVky5Lf',
  JCMRBB9XaTLXZcP25XZfLqCbhvRJLhRGRUjqxBWXaSGn:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  '4jKEHGL4CGzQzPPPVADiVTBY3s5vp9ocx9zLMDUuHmLS':
    '6umYMomwYjDjfxUcyfkcYYUKkNsBj1XGxpEWSN45pY9H',
  '82rfchPLnQJfWFobyfW7CrrGgnQMazMMja2oeHAYkuts':
    '767KgCcnLhLS4ffHdZCyrzi1YhZFYCJ75CdsWnzrasbZ',
  '8bHeYep9S6AjG8q2rNuUYpEpeRZfNsw3z2WBhfizKTSR':
    '4TneEbEtRQTPQQ7gHaMnBi5YV8ZqFLhzELi7kZPT7jMu',
  AarmuVbMghjuqaEhmkEPDy1Ha2CJRJ9zWCasPzh4uKAp:
    'AkKAZ5B8TmZccjJWymUQJaXe1UPXga7FcdDiCX3eJQXu',
  DkbfWSBZ5P1umeXfepXWcPNx4r4p95vw4kFLbBo88eVa:
    'AEEUKbCrFsBteAsn2VxSUhMu7YE9yJNv6nhgfL9gPyTH',
  CC59ymB3rPYXVApmr5ZHndP9ftBRLFudh1PTwcPgEGFD:
    '7K97okP1yvBafsYRBWUwbLNePpGsHb9rhE453NfNcBrj',
  '9yjtGutxVHD3sfcBi6aRaQicHKEnyhkHakDZ3588XajP':
    'BZLxMgpoeQdTfT9iPtDyq7KK7ZY8eGebRZNgT25LXaYj',
  B8xmHGrAsxD9jQchys6SXJYAypJ9sTB6MMfUAkSZBTgz:
    'BoU9a5MSSkEkk3xT7seWgBmS8rygdCR7ZnxHvyoTQyK9',
  DMKnrc88Ku3xP8RfqpTZ8PGZY4yr999rqJiRVrvZ3cK9:
    'FevWcHy4ypJW3ZEx89kbfwfXvqJcJniayoqPimzT2agK',
  '6JED42JTTYpwhC2ceAjxedqWkkYUfhKzrNfHnqpdA3Ko':
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  '2oUy2kZDzNRc3i7uSJssn4b9zrvj1geJriSMJ8VfjK9T':
    '72XnUQhBMjKjqjx2kyA1uB5pbuWz1cFq7dxAR5VAxH3R',
  EvzBQ4UZUJ28ASy46RYm4jWu9fYhPzbioVSwEMFodtz6:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  AHNaGUgxitjn63RcVeisWtUWdBezqwihxJz2V1h3m72F:
    '2ZA9AJwwHN8SnKKSFQ1yeyddLKHMoDFUVTnuYzUq4Djh',
  '8jAXUagrMTWoHNktdB1o35iBSEVLw6yvvxNsxbC9iuuJ':
    'HKhtjDJLDxc4H1hyW6v2p9F8vCRmubHVGFaTZFJNqFsy',
  '5ZsKjqS6EzYskyRwKU2xdsw8fRnZMNVuwWNPiYtVyhkt':
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  BUo1ZR8582QrCiGvsx5sSxMuSAn43pP5AGGK32z8QwEb:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  '2pTwgGkHue9RuABXZBwFVS74CwA6Y21zi2TvezEDaAer':
    '6a65Pf2sRZnxATHYdntmHuYj7dLSKvD9LprWava2uRRM',
  EUEY1S77ZwtZywYrLQLJoctAUKMVrUEi4ZmpkbkGUbf6:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  DYVkwwMRLSpzWqGSQkTnDbH1V9JBoUF84NYf2r5qpyoo:
    '4U49gBDu4g87GpeDTr3nQAV8Q2uyRZ6Jy2UYEWnNfwD5',
  '9922eBNh6iWwDy3SDv34jSXnKKDvaez4bJ6YZJgu4YBc':
    'BCPJwWFh2ncnt9b43jw2wTUBRB7e9tTs8dTjss7He8VR',
  EQrQM57kjXwWqrYvpnvzLYMYG5yReXHkHRa419D3C8HV:
    '4Eoktmv9YeCK2w9mxnzZAJtZJycQLjcU3ixeKxrFoKoH',
  HBbfehNYmCFy7YEx82ACj76ste5Xg1deF8WChe4m6A3x:
    '2LD2HchUjgJL4Ho734SFa9iaCC4iiMbJzbKrfjRnW51D',
  EgebbkvwtD9SYj4x3jLp4b7GMtrhGyicYqmPFQzASAJL:
    '7UoKx3bAf9ooL6nvhis5cYeQjzpGSeCnXhnzCK1pU5yD',
  YAo7cKAyYjCM8gFaDA6pK7ZSNfjsdHSyFSwYKwCXxgT:
    'dQSfiTaJ3g2XsSkN9hexrSioYAX9WnghhYqYxi8sbej',
  CSfCqiwcc6pZ8ARKzWbfUoJW4k4m7MDoXWqYbvEyXQkc:
    '2CrevgwNvQZUr5m98Q1DrvqicBruovV3G27Sy4NVFRrj',
  DHjNjyAXTLPejDPCSJBxjYXz59iBqv9R32sNPqUfhKnr:
    'GJ6kYACnnx19Q4WSdewSdpdnSiCvM4xLcqRPz5DoBF5d',
  '5yushasaLjqrPgg9CmTXvp5uSJLSeNfuJwgw499zLWdm':
    '5Ko1uXVrqhm2VW2e4W5SiB4kvaRCeyNwYfoD3Q9aA6CB',
  CpbBx4t2dZkfWGvTgomccDhTyynuTVmrw6uCuk9feTJ1:
    '5Hfry9o7ohWmDm27HgtA6Nm48rbnj8V9P5aBG8LQj2vo',
  '7KX4NzXf3GKsAqcsM8tjirZZkcRP6uStDtzzkuSW2WmV':
    '6e49dFAnDbeQBsTTJN8y673y1ypLh4goaNvNZch9UEKM',
  Db15DWzdEPZCvHztG55EoUNjDov9D5HyBbiDNsbAyJUg:
    'HHuD2ZsoEsPh1Jat1dzbRKDXPmdJaDXpYVEVAuXhY79u',
  EdWWi3FebVN8e6h7Nsho6Qipe4JuvpJzwYDeZJsgeyNU:
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  AW5cpdGzzKk8az2GdgdrMYkkAiznfeT4XZD1Jro6kh9g:
    '4oALdQoBLnEfqDu1HBxAPHt6B1iMWNgHdLRooyfRK8sM',
  '9LfCf2TTHNWsXT5GXhhX7NrFaeWD9MgCDzWEp13nzA9p':
    'AcFbTzzcs8jope4TJxARLJ5XUPvMfQ1RcJ4ar3mLgs8F',
  '8psBBtYv2Mxy8dn6oUAasUrG3DrUxRWvAFPH367CFe7d':
    'DHGex3oCA3cbkBFcPWS9u76BDCTEPwqeM1uBCEG4NWHh',
  '8mhrx6D6PpyMMMwRwGqyurUWRDAnaTzsgtCdNmx4idSQ':
    '5MCRPsT8XeAEY7UAfcJbs8Ka7nFrmJYprXqA4sFAZvS7',
  '6jkoaTyABqFRinESuS2orFBKv86rFdexKPzcgWhAEAzr':
    '4np6BHqFjBaEBy2BRgjwn2yBZUCZfEUfBReQ6VwF8cBD',
  Cg4ZFSFA3Zvazu3Cy8FacHufv5HBJEenwaZ3syptTXHC:
    'FtKMsVYbbLWi36iZHYBCnkL4rxexp77cDQkujPpRxti7',
  '3ESTJHJNS2FsTXyCbbTCiT6UJhTYbFhZ2BJGTuuuZZwv':
    '8mkTWWZuWUG9mhnzkChfoXALE1RGUtHLJpt6r6R4W1qV',
  WELVDZYMffoumnyNDZEWdFH18K3sPh5KsEztNgL8i1U:
    '7MHHYKyxMRTSWwteUcYePs9HtQkTCJ7Wi6ZCjzPLHwd5',
  CwaV5AUSUxXd8qWFxaKzb5g4wrUJ8rTXEHLU3kMg3BFU:
    '2EP6we5hEFtnGqSZrMVz3GpCGiNs6yHXEnEui7x69979',
  '6YbEcAhtbdugMityFt8wHGCa8fw7K4Co7JZATrxM9sUG':
    'GQyywMrvYitAvaVBUtXLhgbqFAYPpxU6eFBKbcC9DdiT',
  ErpAzLjs62TwkqeafEeSVG5UffqTURDMx7tBxx846xyE:
    'H2dLTgmxEZLj7F9foK4YspuACmxcQ4kpa2qnw9RTAdZV',
  DNAeRS8rtGcfoXgvSrwKWz8fBfwWhstsFktRQB4M4c5i:
    'BGPtvDCiKJ4T5oWuXGoHqdXQaJQkfqdKG4udMkxvF4w',
  hbmsAZVewCnGFkTXePhNcdea3cnLqcZZG4ybCGwoDyK:
    '8ket7o5KGwFhWYDMyj4HhSExGRCqaKiVs7SkmNXNf9K1',
  '5gHxpdyoirFphGW8kprP63AqiAxYTB2PdUqUQUosUeUJ':
    'AKAcSJpYcbTWztFoo5FM9gHesFxWSunStC5g6tbFFYVq',
  KJu2jrpbnxc2U9gP7mnVEq8B8cEBCAVpjMBp4RB6vKu:
    'Avf2Ed8Vxw75NBNrAdp6qM5fDfykJv7SfFiGMMbjxfCf',
}
