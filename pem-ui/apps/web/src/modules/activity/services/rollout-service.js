import { RestApiService } from '../../../common/api-handler/rest-api-service';
import { API_METHODS, API_END_POINTS } from '../constants';

// Function to get the Partners List
export const getPartnerList = async (selectedPartnerType) => {
  let url = `${API_END_POINTS.PARTNERS_LIST}/${selectedPartnerType}/`;
  let config = {
    url,
    method: API_METHODS.GET
  };
  const response = await new RestApiService().call(config, null);
  return response.success ? response?.data : [];
};

// Function to get the Attribute Type List
export const getAttributeTypeList = async () => {
  let url = `${API_END_POINTS.ATTRIBUTE_TYPES}`;
  let config = {
    url,
    method: API_METHODS.GET
  };
  const response = await new RestApiService().call(config, null);
  return response.success ? response?.data : [];
};

// Function to get the Attributes List
export const getAttributeList = async (selectedAttributeType) => {
  let url = `${API_END_POINTS.ATTRIBUTE_LIST}/${selectedAttributeType}/`;
  let config = {
    url,
    method: API_METHODS.GET
  };
  const response = await new RestApiService().call(config, null);
  return response.success ? response?.data : [];
};

// Function to get the Group List
export const getGroupList = async (selectedAttributeType) => {
  let url = `${API_END_POINTS.ATTRIBUTE_LIST}/${selectedAttributeType}/`;
  let config = {
    url,
    method: API_METHODS.GET
  };
  const response = await new RestApiService().call(config, null);
  return response.success ? response?.data : [];
};
