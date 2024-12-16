import logger from '@vepler/logger';

interface UpstreamError extends Error {
    response?: {
        status: number;
        config: {
            url: string;
            method: string;
            headers: Record<string, string>;
        };
        data: any;
    };
    request?: any;
}

export default (error: UpstreamError): Promise<string> => {
    if (error.response) {
        const { status, config, data } = error.response;
        logger.error(error, 'Response Error', {
            status,
            url: config.url,
            method: config.method,
            headers: config.headers,
            response: data,
        });
    } else if (error.request) {
        logger.error(error, 'Request Error', {
            message: 'The request was made but no response was received',
            request: error.request,
        });
    } else {
        logger.error(error, 'Setup Error', {
            message: 'Something happened in setting up the request that triggered an error',
            error: error.message,
        });
    }

    return Promise.reject(error.message);
};
