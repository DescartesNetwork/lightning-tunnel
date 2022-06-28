import { BN } from '@project-serum/anchor'

export const utilsBN = {
  /**
   * Add decimals to the number
   * @param num
   * @param decimals
   * @returns
   */
  decimalize: (num: string | number, decimals: number): BN => {
    if (!num) return new BN(0)
    if (decimals < 0 || decimals % 1 !== 0)
      throw new Error('decimals must be an integer greater than zero')
    const n = num.toString()
    if (!decimals) return new BN(n)
    const m = n.split('.')
    if (m.length > 2) throw new Error('Invalid number')
    if (m.length === 1) return new BN(num).mul(new BN(10 ** decimals))
    if (m[1].length >= decimals)
      return new BN(m[0] + m[1].substring(0, decimals))
    else return new BN(m[0] + m[1] + '0'.repeat(decimals - m[1].length))
  },

  /**
   * Remove decimals from the number
   * @param numBN
   * @param decimals
   * @returns
   */
  undecimalize: (numBN: BN, decimals: number): string => {
    if (decimals < 0 || decimals % 1 !== 0)
      throw new Error('decimals must be an integer greater than zero')
    if (!numBN) return '0'
    const n = numBN.toString()
    if (!decimals) return n

    let integer =
      n.length > decimals ? n.substring(0, n.length - decimals) : '0'
    let fraction: string | string[] = ''
    if (n.length > decimals)
      fraction = n.substring(n.length - decimals, n.length)
    else if (n.length === decimals) fraction = n
    else fraction = '0'.repeat(decimals - n.length) + n

    fraction = fraction.split('')
    while (fraction[fraction.length - 1] === '0') fraction.pop()
    fraction = fraction.join('')
    if (!fraction) return integer
    return integer + '.' + fraction
  },

  toNumber: (numBN: BN): number => {
    return Number(utilsBN.undecimalize(numBN, 0))
  },

  fromBigint: (amount: bigint): BN => {
    return new BN(amount.toString())
  },
}
