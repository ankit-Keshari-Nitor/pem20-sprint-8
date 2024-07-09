import { API_END_POINTS } from './../constants';
import { RestApiService } from '../../../common/api-handler/rest-api-service';

export const getActivityList = async (pageNo, pageSize, sortDir = 'ASC', searchKey = '', status = '', sortBy = 'modifyts') => {
  const url = `${API_END_POINTS.ACTIVITY_DEFINITION}`;
  let config = {
    url,
    params: {
      application: 'PEM',
      sortDir: sortDir,
      pageNo: pageNo,
      pageSize: pageSize,
      sortBy: sortBy,
      status: status,
      name: `con:${searchKey}`
    }
  }

  const response = await new RestApiService().call(config, null);
  if (response.success) {
    const customizedData = response.data.content.map((e) => ({
      id: e.activityDefnKey,
      activityDefnVersionKey: e.defaultVersion.activityDefnVersionKey,
      version: e.defaultVersion.version,
      isEncrypted: e.defaultVersion.isEncrypted,
      status: e.defaultVersion.status,
      ...e
    }));

    return {
      success: true,
      content: customizedData || [],
      pageContent: response.data.pageContent
    };
  } else {
    return {
      success: false,
      content: [],
      pageContent: {},
    }
  }

};

export const deleteActivity = async (activityDefnKey) => {

  let url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}`;
  let config = {
    url,
    method: 'DELETE'
  }

  const response = await new RestApiService().call(config, null);
  if (response.success) {
    return {
      success: true,
    }
  } else {
    return {
      success: false,
    }
  }

};

export const markActivityDefinitionAsFinal = async (activityDefnKey, activityDefnKeyVersion) => {

  let url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}/versions/${activityDefnKeyVersion}/actions/markAsFinal`;
  let config = {
    url,
    method: 'POST',
    data: ''
  }

  const response = await new RestApiService().call(config, null);
  if (response.success) {
    return {
      success: true,
      status: response.data.status
    }
  } else {
    return {
      success: false,
      status: response?.data?.status
    }
  }

};

export const getActivityDetails = async (activityKey, activityVersoinKey) => {
  const url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityKey}`;
  const response = await new RestApiService().call({ url }, null);
  if (response.success) {
    const activityVersions = await new RestApiService.call({ url: `${url}versions?&pageNo=0&pageSize=100` }, null);
    const activityCurrentVersionDetails = await new RestApiService().call({ url: `${url}versions/${activityVersoinKey}` }, null);
    const activityCurrentVersionData = await new RestApiService().call({ url: `${url}versions/${activityVersoinKey}/data` }, null);
    return {
      success: true,
      definition: {
        name: response.data.name,
        description: response.data.description,
        definationKey: response.data.key
      },
      versions: activityVersions.data.content,
      version: {
        key: activityCurrentVersionDetails.data.key,
        encrypted: activityCurrentVersionDetails.data.isEncrypted, //false,
        contextData: activityCurrentVersionDetails.data.contextData,
        status: activityCurrentVersionDetails.data.status,
        number: activityCurrentVersionDetails.data.version
      },
      schema: {
        nodes: activityCurrentVersionData.data.nodes,
        edges: activityCurrentVersionData.data.edges
      }
    };
  } else {
    return {
      success: false,
      data: null
    };
  }
};

export const saveActivityData = async (activityData) => {
  const url = `${API_END_POINTS.ACTIVITY_DEFINITION}`;
  const file = new Blob([JSON.stringify(activityData)], { type: 'text/json' });
  const config = {
    url,
    data: {
      name: activityData.name,
      description: activityData.description,
      application: 'PEM',
      file: file
    }
  };
  return await new RestApiService().callWithFile(config, null);
};
