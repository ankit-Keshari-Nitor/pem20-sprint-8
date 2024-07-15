import Shell from '@b2bi/shell';
import { API_METHODS, API_END_POINTS } from '../constants';

const generateOptions = (param = {}) => {
  const options = {
    headers: {
      Accept: 'application/json'
    },
    params: param
  };

  return options;
};

// Function to get the Attribute Type List
export const getAttributeTypeList = async () => {
  let url = `${API_END_POINTS.ATTRIBUTE_TYPES}`;
  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions());
  return response.status === 200 ? response?.data : [];
};

// Function to get the Attributes List
export const getAttributeList = async (selectedAttributeType, searchKey) => {
  console.log('selectedAttributeType', selectedAttributeType);
  let url = `${API_END_POINTS.ATTRIBUTE_LIST}/${selectedAttributeType}/attributeValues`;
  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions());
  console.log('response', response);
  return response.status === 200 ? response?.data : [];
};

// Function to get the Partners List
export const getPartnerList = async (param) => {
  let url = `${API_END_POINTS.PARTNERS_LIST}`;

  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions(param));
  return response.status ? response?.data : [];
};

// Function to get the Group List
export const getGroupList = async (selectedAttributeType) => {
  let url = `${API_END_POINTS.ATTRIBUTE_TYPES}`;
  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions());
  return response.status ? response?.data : [];
};
