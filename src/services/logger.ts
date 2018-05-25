import { Service } from 'typedi'
import { createLogger, Logger as LoggerInstance, transports, format } from 'winston'
import { Format } from 'logform'

@Service({
    global: true,
})
export class Logger {
    private winston: LoggerInstance

    public constructor() {
        const { Console } = transports

        this.winston = createLogger({
            level: this.fetchVerbosity('info'),
            format: this.formatMessage(),
            transports: [new Console()],
        })
    }

    public error(message: string): void {
        this.winston.error(message)
    }

    public warn(message: string): void {
        this.winston.warn(message)
    }

    public info(message: string): void {
        this.winston.info(message)
    }

    public verbose(message: string): void {
        this.winston.verbose(message)
    }

    public debug(message: string): void {
        this.winston.debug(message)
    }

    public silly(message: string): void {
        this.winston.silly(message)
    }

    private fetchVerbosity(defaultValue: string = 'info'): string {
        const envValue: string = process.env.LOGLEVEL || ''

        switch (envValue.toLowerCase()) {
            case 'verbose':
                return 'verbose'

            case 'debug':
                return 'debug'

            case 'silly':
                return 'silly'

            default:
                return defaultValue
        }
    }

    private formatMessage(): Format {
        const { printf } = format
        const date = this.formatTime(new Date())

        return printf(info => `[${info.level}/${date}]: ${info.message}`)
    }

    private formatTime(date: Date): string {
        const zerofy = (value: number): string => `0${value}`.slice(-2)
        const hours = zerofy(date.getHours())
        const minutes = zerofy(date.getMinutes())
        const seconds = zerofy(date.getSeconds())

        return `${hours}:${minutes}:${seconds}`
    }
}
