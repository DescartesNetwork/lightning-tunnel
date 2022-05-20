import { Utility } from '@sentre/utility'
import { Net } from 'shared/runtime'
import SafeWallet from 'app/helper/safeWallet'

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
    node: 'https://api.devnet.solana.com',
    utility: new Utility(new SafeWallet(), 'https://api.devnet.solana.com'),
    fee: 1000000,
    taxman: '8W6QginLcAydYyMYjxuyKQN56NzeakDE3aRFrAmocS6D',
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    utility: new Utility(new SafeWallet(), 'https://api.devnet.solana.com'),
    fee: 1000000,
    taxman: '8W6QginLcAydYyMYjxuyKQN56NzeakDE3aRFrAmocS6D',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://sentre.genesysgo.net',
    utility: new Utility(new SafeWallet(), 'https://sentre.genesysgo.net'),
    fee: 1000000,
    taxman: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
  },
}

/**
 * Module exports
 */
export default conf
