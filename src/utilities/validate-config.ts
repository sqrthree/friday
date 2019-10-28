import config from 'config'
import _ from 'lodash'
import path from 'path'

import validator from '../services/validator'
import loader from './loader'
import loggerGenerator from './logger'

const logger = loggerGenerator('validate-config')

export default function validate() {
  const configDir = config.util.getEnv('NODE_CONFIG_DIR')
  const shemaFilePath = path.join(configDir, 'schema.json')
  const configurations = config.util.loadFileConfigs()

  let schema

  try {
    schema = loader(shemaFilePath)
  } catch (err) {
    logger.warn(
      `Skip the verification of your configurations because there is no config schema file in ${shemaFilePath}.`
    )
    return
  }

  try {
    validator(schema, configurations)
  } catch (err) {
    logger.error(`Invalid configurations from ${configDir}:`)

    _.forEach(err.errors, item => {
      logger.error(`  ${item.dataPath} ${item.message}`)
    })

    throw err
  }
}
