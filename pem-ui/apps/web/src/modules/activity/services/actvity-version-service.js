import { API_END_POINTS } from './../constants';
import { RestApiService } from '../../../common/api-handler/rest-api-service';

export const getActivityVersionList = async (activityDefnKey, pageNo, pageSize, sortDir = 'DESC', sortBy = 'modifyTs', status = '') => {
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