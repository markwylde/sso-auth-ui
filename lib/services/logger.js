const packageJson = require('../../package.json')
const util = require('util')

const chalk = {
  cyan: (...args) => console.log('\x1b[36m%s\x1b[0m', ...args),
  white: (...args) => console.log('\x1b[37m%s\x1b[0m', ...args),
  yellow: (...args) => console.log('\x1b[33m%s\x1b[0m', ...args),
  red: (...args) => console.log('\x1b[31m%s\x1b[0m', ...args),
  bgRed: (...args) => console.log('\x1b[31m%s\x1b[0m', ...args)
}

let logger

const debugLogger = (type, args) => {
  process.stdout.write((type + '       ').substr(0, 16))
  for (let arg of args) {
    if (typeof arg === 'object') {
      process.stdout.write(' ' + util.inspect(arg))
    } else {
      process.stdout.write(' ' + arg.toString())
    }
  }
  process.stdout.write('\n')
}

const productionLogger = (type, args) => {
  let output
  try {
    output = JSON.stringify({...args, type})
  } catch (error) {
    output = JSON.stringify({type, text: args})
  }
}

if (process.env.DEBUG_LOGGING === 'true') {
  logger = {
    trace: (...args) => debugLogger(chalk.cyan('TRACE'), args),
    debug: (...args) => debugLogger(chalk.cyan('DEBUG'), args),
    info: (...args) => debugLogger(chalk.white('INFO'), args),
    warn: (...args) => debugLogger(chalk.yellow('WARN'), args),
    error: (...args) => debugLogger(chalk.red('ERROR'), args),
    fatal: (...args) => debugLogger(chalk.bgRed('FATAL'), args)
  }
} else {
  logger = {
    trace: (...args) => productionLogger(chalk.cyan('TRACE'), args),
    debug: (...args) => productionLogger(chalk.cyan('DEBUG'), args),
    info: (...args) => productionLogger(chalk.white('INFO'), args),
    warn: (...args) => productionLogger(chalk.yellow('WARN'), args),
    error: (...args) => productionLogger(chalk.red('ERROR'), args),
    fatal: (...args) => productionLogger(chalk.bgRed('FATAL'), args)
  }
}

module.exports = logger
