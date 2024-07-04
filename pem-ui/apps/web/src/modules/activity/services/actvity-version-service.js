import { API_END_POINTS } from './../constants';
import { RestApiService } from '../../../common/api-handler/rest-api-service';

export const getActivityVersions = async (activityDefnKey) => {
  const config = {
    url: `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}/versions?&pageNo=0&pageSize=100`
  };
  const response = await new RestApiService().call(config, null);
  return { success: response.success, data: response.status ? response.data.content : [] };
};

export const getActivityVersionData = async (activityDefnKey, activityDefnVersionKey) => {
  try {
    const url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}/versions/${activityDefnVersionKey}`;
    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return undefined;
    }
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

export const getActivityVersionList = async (activityDefnKey) => {
  try {
    const url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}/versions`;
    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return undefined;
    }
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};
