import { env, net } from '@sentre/senhub'
import manifest from './manifest.config'
import sol from './sol.config'
import api from './api.config'

const configs = {
  manifest: manifest[env],
  sol: sol[net],
  api: api[env],
}

/**
 * Module exports
 */
export default configs
