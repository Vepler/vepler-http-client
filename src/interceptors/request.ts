import { AxiosRequestConfig } from 'axios';
import logger from '@vepler/logger';

const logRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    try {
        const method = config.method ? config.method.toUpperCase() : 'UNKNOWN';
        const baseURL = config.baseURL || '';
        const url = config.url ? `${baseURL}${config.url}` : 'No URL';
        const headers = config.headers || {};
        const params = config.params || {};
        const timestamp = new Date().toISOString();

        logger.info(`[${timestamp}] [${method}] - ${url}`);
        logger.debug(`[Request Headers] - ${JSON.stringify(headers)}`);
        logger.debug(`[Request Params] - ${JSON.stringify(params)}`);

        return config;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error, `Error in request interceptor for URL: ${config.url || 'unknown'}`);
        } else {
            const customError = new Error('Unknown error in request interceptor');
            logger.error(customError, `Unknown error type in request interceptor for URL: ${config.url || 'unknown'}`);
        }
        throw error;
    }
};

export default logRequest;
