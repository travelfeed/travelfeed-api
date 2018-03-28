import * as debug from 'debug'

const prefix: string = 'api'
const divider: string = '|'

export function enableLogging(): void {
    debug.enable(`${prefix}${divider}*`)
}

export function logger(name: string): debug.IDebugger {
    return debug(`${prefix}${divider}${name}`)
}
