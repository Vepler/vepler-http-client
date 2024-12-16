import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import logRequest from './interceptors/request';
import interceptorResponseSuccess from './interceptors/response-success';
import interceptorResponseError from './interceptors/response-error';
import PinoWrapper from '@vepler/logger';  // Adjust the import path as needed

interface Options {
  host: string;
  timeout?: number;
  logLevel: string;
  headers?: Record<string, string>;
}

interface QueryParams {
  token?: string;
  apiKey?: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

type ResourceParams = Record<string, any>;

const ensureProtocol = (hostname: string): string =>
  /^https?:\/\//i.test(hostname) ? hostname : `http://${hostname}`;

const configureRequest = (
  token?: string,
  apiKey?: string,
  headers?: Record<string, string>
): AxiosRequestConfig => {
  const config: AxiosRequestConfig = { headers: {} };

  // Initialize headers if they are undefined
  config.headers = config.headers || {};

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }

  if (headers) {
    config.headers = { ...config.headers, ...headers };
  }

  return config;
};

const handleResponse = (response: AxiosResponse): any => response.data;

const handleError = (error: any): never => {
  throw new Error(`[RWV] ApiService Error: ${error.message}`);
};

const createAxiosInstance = (options: Options): AxiosInstance => {
  // Initialize the logger
  PinoWrapper.initialize({ level: options.logLevel || 'info' });

  const http = axios.create({
    baseURL: ensureProtocol(options.host),
    timeout: options.timeout || 3000,
    headers: options.headers,
  });

  // @ts-expect-error - The interceptors are not defined in the AxiosInstance type
  http.interceptors.request.use(logRequest);
  http.interceptors.response.use(interceptorResponseSuccess, interceptorResponseError);

  return http;
};

const ApiService = {
  /**
   * Create a new Axios instance with the provided options.
   * @param options - Configuration options for the Axios instance.
   * @returns An object containing the Axios client and CRUD methods.
   */
  create(options: Options) {
    const http = createAxiosInstance(options);

    return {
      client: http,
      /**
       * Send a GET request to the specified resource with optional query parameters.
       * @param resource - The resource endpoint.
       * @param params - The request parameters.
       * @param queryParams - Additional query parameters and headers.
       * @returns The response data.
       */
      async query(resource: string, params: ResourceParams, queryParams: QueryParams = {}) {
        return http.get(resource, {
            ...configureRequest(
              queryParams.token,
              queryParams.apiKey,
              queryParams.headers
            ),
            params
          }
        ).then(handleResponse).catch(handleError);
      },
      /**
       * Send a GET request to the specified resource with an optional slug and query parameters.
       * @param resource - The resource endpoint.
       * @param slug - The resource identifier.
       * @param queryParams - Additional query parameters and headers.
       * @returns The response data.
       */
      async get(resource: string, slug: string = '', queryParams: QueryParams = {}) {
        return http.get(`${resource}/${slug}`, configureRequest(
          queryParams.token,
          queryParams.apiKey,
          queryParams.headers
        ))
          .then(handleResponse).catch(handleError);
      },
      /**
       * Send a POST request to the specified resource with the provided data.
       * @param resource - The resource endpoint.
       * @param data - The request payload.
       * @param queryParams - Additional query parameters and headers.
       * @returns The response data.
       */
      async post(resource: string, data: any, queryParams: QueryParams = {}) {
        return http.post(resource, data, configureRequest(
          queryParams.token,
          queryParams.apiKey,
          queryParams.headers
        ))
          .then(handleResponse).catch(handleError);
      },
      /**
       * Send a PUT request to the specified resource with the provided data.
       * @param resource - The resource endpoint.
       * @param data - The request payload.
       * @param queryParams - Additional query parameters and headers.
       * @returns The response data.
       */
      async put(resource: string, data: any, queryParams: QueryParams = {}) {
        return http.put(resource, data, configureRequest(
          queryParams.token,
          queryParams.apiKey,
          queryParams.headers
        ))
          .then(handleResponse).catch(handleError);
      },
      /**
       * Send a DELETE request to the specified resource with an optional slug and query parameters.
       * @param resource - The resource endpoint.
       * @param slug - The resource identifier.
       * @param queryParams - Additional query parameters and headers.
       * @returns The response data.
       */
      async delete(resource: string, slug: string = '', queryParams: QueryParams = {}) {
        return http.delete(`${resource}/${slug}`, configureRequest(
          queryParams.token,
          queryParams.apiKey,
          queryParams.headers
        ))
          .then(handleResponse).catch(handleError);
      },
    };
  },
};

export default ApiService;
