import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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

declare const ApiService: {
  create(options: Options): {
    client: AxiosInstance;
    query(resource: string, params: ResourceParams, queryParams?: QueryParams): Promise<any>;
    get(resource: string, slug?: string, queryParams?: QueryParams): Promise<any>;
    post(resource: string, data: any, queryParams?: QueryParams): Promise<any>;
    put(resource: string, data: any, queryParams?: QueryParams): Promise<any>;
    delete(resource: string, slug?: string, queryParams?: QueryParams): Promise<any>;
  };
};

export default ApiService;
