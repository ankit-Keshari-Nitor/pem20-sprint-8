import { API_END_POINTS } from './../constants';
import { RestApiService } from '../../../common/api-handler/rest-api-service';

export const getActivityVersionList = async (activityDefnKey, pageNo, pageSize, sortDir = 'DESC', sortBy = 'modifyTs', status = '') => {

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

  const response = await new RestApiService().call(config, null);
  if (response.success) {
    const customizedData = response.data.content !== null && response.data.content.map((e) => ({
      id: e.activityDefnVersionKey,
      ...e
    }));
    return {
      success: true,
      content: customizedData || [],
      pageContent: response?.data?.page
    }

  } else {
    return {
      success: false,
      content: [],
      pageContent: {},
    }
  }


}