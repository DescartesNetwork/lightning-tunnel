import { Utility } from '@sentre/utility'
import { Net, rpc } from '@sentre/senhub'

import SafeWallet from 'helper/safeWallet'

/**
 * Contructor
 */
type Conf = {
  node: string
  utility: Utility
  fee: number
  taxman: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    node: rpc,
    utility: new Utility(
      new SafeWallet(),
      rpc,
      'A3PPh3nGBJs19KESDbBvLgwwMY4VSYFh9FNJV33wDftK',
    ),
    fee: 1000000,
    taxman: '8W6QginLcAydYyMYjxuyKQN56NzeakDE3aRFrAmocS6D',
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: rpc,
    utility: new Utility(new SafeWallet(), rpc),
    fee: 1000000,
    taxman: '8W6QginLcAydYyMYjxuyKQN56NzeakDE3aRFrAmocS6D',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: rpc,
    utility: new Utility(new SafeWallet(), rpc),
    fee: 1000000,
    taxman: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
  },
}

/**
 * Module exports
 */
export default conf
