import logRequest from '../../src/interceptors/request';
import logger from '@vepler/logger';
import { AxiosRequestConfig } from 'axios';

jest.mock('@vepler/logger', () => ({
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
}));

describe('logRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should log request details and return the config', () => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            baseURL: 'https://api.example.com',
            url: '/users',
            headers: { 'Content-Type': 'application/json' },
            params: { page: 1, limit: 10 },
        };

        const result = logRequest(config);

        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('[GET] - https://api.example.com/users'));
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('[Request Headers] - {"Content-Type":"application/json"}'));
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('[Request Params] - {"page":1,"limit":10}'));
        expect(result).toEqual(config);
    });

    test('should handle missing request details', () => {
        const config: AxiosRequestConfig = {};

        const result = logRequest(config);

        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('[UNKNOWN] - No URL'));
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('[Request Headers] - {}'));
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('[Request Params] - {}'));
        expect(result).toEqual(config);
    });

    test('should log error and rethrow when an error occurs', () => {
        const config: AxiosRequestConfig = {
            url: '/users',
        };

        jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
            throw new Error('JSON stringify error');
        });

        expect(() => logRequest(config)).toThrowError('JSON stringify error');
        expect(logger.error).toHaveBeenCalledWith(expect.any(Error), 'Error in request interceptor for URL: /users');
    });

    test('should handle unknown error type', () => {
        const config: AxiosRequestConfig = {
            url: '/users',
        };

        jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
            throw 'Unknown error';
        });

        expect(() => logRequest(config)).toThrowError('Unknown error');
        expect(logger.error).toHaveBeenCalledWith(expect.any(Error), 'Unknown error type in request interceptor for URL: /users');
    });
});
