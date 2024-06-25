import { GROUP_LIST_DATA, ATTRIBUTE_LIST_DATA, PARTNER_LIST_DATA, TEST_DIALOG_DATA } from '../constants';

// TODO with actual api url
export const getGroupList = async () => {
  try {
    return await GROUP_LIST_DATA;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

// TODO with actual api url
export const getAttributeList = async (selectedAttributeType) => {
  try {
    let response = [];
    if (selectedAttributeType === '') {
      response = [];
    } else {
      response = ATTRIBUTE_LIST_DATA;
    }
    return await response;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

// TODO with actual api url
export const getPartnerList = async (selectedPartnerType) => {
  try {
    let response = [];
    if (selectedPartnerType === '') {
      response = [];
    } else {
      response = PARTNER_LIST_DATA;
    }
    return await response;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

export const getTestList = async () => {
  try {
    return await TEST_DIALOG_DATA;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};
