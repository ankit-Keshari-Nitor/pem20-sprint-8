import HttpService from './http-service';


function resolveUrl(url, input) {
  Object.keys(input).forEach((key) => {
    url.replace(`{${key}}`, input[key]);
  })
  return url;
};
class RestApiService {
  async call(config, input) {

    const headers = {
      ...config.headers,
     Accept: 'application/json'
    }
    const restReq = {
      url: input ? resolveUrl(config.url, input) : config.url,
      method: config.method ? config.method : "GET",
      data: config?.data,
      params: config?.params,
      //baseURL: window.sfgBackendBaseUrl,
      headers: headers,
      //paramsSerializer: customParamsSerializer
    };
    try {
      const response = await HttpService.send(restReq);
      if (response.statusText !== "OK") {
        console.error(`HTTP error! status: ${response.status}`);
        return {
          success: false,
          data: response.statusText,
          status: response.status
        };
      }
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return {
        success: false,
        data: error
      };
    }
  }
}

export { RestApiService };
