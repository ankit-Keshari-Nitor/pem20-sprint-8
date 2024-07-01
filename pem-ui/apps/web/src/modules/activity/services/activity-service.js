import { API_URL } from './../constants';

export const getActivityList = async (pageNo, pageSize, sortDir = 'ASC', searchKey = '', status = '') => {
  try {
    let url = `${API_URL.ACTIVITY_DEFINITION}?application=PEM&sortDir=${sortDir}&pageNo=${pageNo}&pageSize=${pageSize}`;

    if (searchKey !== '') {
      url += `&name=${searchKey}`;
    }
    if (status !== '') {
      url += `&status=${status}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return { content: [], pageContent: {} };
    }
    const jsonData = await response.json();

    const customizedData = jsonData.content !== null && jsonData.content.map((e) => ({
      id: e.activityDefnKey,
      ...e
    }));

    return {
      content: customizedData || [],
      pageContent: jsonData.pageContent || []
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

export const deleteActivity = async (activityDefnKey) => {
  try {
    let url = `${API_URL.ACTIVITY_DEFINITION}/${activityDefnKey}`;
    const response = await fetch(url, {
      method: 'DELETE'
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return {
        success: false
      };
    }
    return {
      success: true,
      data: response.json()
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      success: false
    };
  }
};

export const getActivityVersionkey = async (pageNo, pageSize, sortDir = 'ASC', status = '', isDefault = '', activityDefnKey) => {
  try {
    let url = `${API_URL.ACTIVITY_DEFINITION}/${activityDefnKey}/versions?isDefault=${isDefault}&sortDir=${sortDir}&pageNo=${pageNo}&pageSize=${pageSize}&status=${status}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return { content: [], page: {} };
    }

    const responseBody = await response.text();
    try {
      const jsonData = JSON.parse(responseBody);
      const customizedData = jsonData.content !== null && jsonData.content.map((e) => ({
        id: e.activityDefnVersionKey,
        ...e
      }));
      return {
        content: customizedData || [],
        pageContent: jsonData.page || []
      };

    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

export const markActivityDefinitionAsFinal = async (activityDefnKey, activityDefnKeyVersion) => {
  try {
    let url = `${API_URL.ACTIVITY_DEFINITION}/${activityDefnKey}/versions/${activityDefnKeyVersion}/actions/markAsFinal`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: ''
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return "Internal Error";
    }
    const responseBody = await response.text();
    try {
      const responseStatus = JSON.parse(responseBody);
      return responseStatus.status;
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return "Internal Error";
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return "Internal Error";
  }
};

export const getActivityDetails = async (activityDefnKey) => {
  try {
    const url = `${API_URL.ACTIVITY_DEFINITION}/${activityDefnKey}`;
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

/* ----------------------------- Get the version data of activity -------------------------------------------- */

export const getActivityVersionData = async (activityDefnKey, activityDefnVersionKey) => {
  try {
    const url = `${API_URL.ACTIVITY_DEFINITION}/${activityDefnKey}/versions/${activityDefnVersionKey}`;
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

/* ----------------------------- Get the version list of activity -------------------------------------------- */

export const getActivityVersionList = async (activityDefnKey) => {
  try {
    const url = `${API_URL.ACTIVITY_DEFINITION}/${activityDefnKey}/versions`;
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
