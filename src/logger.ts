import * as debug from 'debug'
import chalk from 'chalk'

const prefix: string = 'api|'
const suffix: string = ''
const divider: string = '|'

export enum Level {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    VERBOSE = 'verbose',
    DEBUG = 'debug',
    SILLY = 'silly'
}

type Handler = (formatter: any, ...args: Array<any>) => void

export interface Handlers {
    error: Handler
    warn: Handler
    info: Handler
    verbose: Handler
    debug: Handler
    silly: Handler
}

export function enableLogging(): void {
    debug.enable(`${prefix}${divider}*,-socket.io*`)
    debug.formatters.h = (value: any): string => chalk.cyan(value)
}

export function logger(name: string): Handlers
export function logger(name: string, level: Level): Handler
export function logger(name: string, level?: Level): Handler | Handlers {
    const colorize = (handler: Handler, color: any): Handler => {
        return (formatter: any, ...args: Array<any>): void => {
            handler(color(formatter), ...args)
        }
    }
    const levelize = (levelprefix: Level): Handler => {
        const params: Array<string> = []
        params.push(name)
        params.push(levelprefix)
        return debug(`${prefix}${params.filter(v => v.length > 0).join(divider)}${suffix}`)
    }

    if (level) {
        return levelize(level)
    }

    return {
        error: colorize(levelize(Level.ERROR), chalk.red),
        warn: colorize(levelize(Level.WARN), chalk.yellow),
        info: colorize(levelize(Level.INFO), chalk.white),
        verbose: colorize(levelize(Level.VERBOSE), chalk.grey),
        debug: colorize(levelize(Level.DEBUG), chalk.grey),
        silly: colorize(levelize(Level.SILLY), chalk.grey)
    }
}
