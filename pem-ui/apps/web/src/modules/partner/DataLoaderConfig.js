import ListAPIHandler from '../../common/api-handler/list';

const DataLoaderConfig = {
  PARTNER: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        // url: getEnvironmentValue('USER.PERMISSIONTREE')
        url: '/rest/sponsors/hsbc/partners',
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'partnerKey');
        }
      };
    }
  }
};

export default DataLoaderConfig;
