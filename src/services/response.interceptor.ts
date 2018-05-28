import { Interceptor, InterceptorInterface, Action } from 'routing-controllers'

@Interceptor()
export class ResponseInterceptor implements InterceptorInterface {
    /**
     * Standardizes all successful reponses to a predefined format using status + result.
     *
     * @param {Action} action
     * @param {any} data
     * @returns {any}
     */
    public intercept(action: Action, data: any): any {
        const status: number = action.response.statusCode

        if (status >= 200 && status < 300 && data && !data.skipFormat) {
            return { status, data }
        }

        if (data.skipFormat) {
            delete data.skipFormat
        }

        return data
    }
}
