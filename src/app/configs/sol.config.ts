import { Net } from 'shared/runtime'

/**
 * Contructor
 */
type Conf = {
  node: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    node: 'https://api.devnet.solana.com',
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://sentre.genesysgo.net',
  },
}

/**
 * Module exports
 */
export default conf
