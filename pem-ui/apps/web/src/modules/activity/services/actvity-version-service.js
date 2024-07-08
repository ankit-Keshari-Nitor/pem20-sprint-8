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


export const getActivityVersionList = async (activityDefnKey, pageNo, pageSize, status = '', sortDir = 'DESC', sortBy = 'modifyTs',) => {
  try {
    let url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}/versions`;

    let config = {
      url,
      params: {
        status: status,
        pageNo: pageNo,
        pageSize: pageSize,
        sortBy: sortBy,
        sortDir: sortDir,
      }
    }

    const activityVersionList = await new RestApiService().call(config, null);
    if (activityVersionList.success) {
      const customizedData = activityVersionList.data.content !== null && activityVersionList.data.content.map((e) => ({
        id: e.activityDefnVersionKey,
        ...e
      }));
      return {
        success: true,
        content: customizedData || [],
        pageContent: activityVersionList?.data?.page
      }

    } else {
      return {
        success: false,
        content: [],
        pageContent: {},
      }
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      content: [],
      pageContent: {},
    }
  }

}