import { HttpService } from './HttpService';
import { generatePath } from 'react-router-dom';

function customParamsSerializer(params) {
  const parts = [];

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val !== undefined && val !== null) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
          }
        });
      } else if (value !== undefined && value !== null) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }
  return parts.join('&');
}

class RestApiService {
  call(dataLoaderConfig, input, options) {
    const restReq = {
      url: generatePath(dataLoaderConfig.url, input),
      method: dataLoaderConfig.method,
      data: input,
      params: options?.params,
      baseURL: window.sfgBackendBaseUrl,
      headers: options.headers,
      paramsSerializer: customParamsSerializer
    };
    if (dataLoaderConfig.handleUrl) {
      restReq.url = dataLoaderConfig.handleUrl(restReq.url, input, options);
    }
    return HttpService.send(restReq);
  }
}

export default RestApiService;
