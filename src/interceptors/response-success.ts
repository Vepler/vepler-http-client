import logger from '@vepler/logger';
import { AxiosResponse } from 'axios';

const handleResponse = (response: AxiosResponse): AxiosResponse => {
  logger.trace('Response received:', response);

  return response;
};

export default handleResponse;
