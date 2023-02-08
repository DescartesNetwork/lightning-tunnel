import { Env } from '@sentre/senhub'

/**
 * Constructor
 */

type Conf = {
  senApiUpload: string
  aws: string
}

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    senApiUpload: 'https://api.sentre.io/storage/upload',
    aws: 'https://sen-storage.s3.us-west-2.amazonaws.com/',
  },

  /**
   * Production configurations
   */
  production: {
    senApiUpload: 'https://api.sentre.io/storage/upload',
    aws: 'https://sen-storage.s3.us-west-2.amazonaws.com/',
  },
}

/**
 * Module exports
 */
export default conf
