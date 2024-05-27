import { API_URL } from './constants';

export const getActivityList = async (pageNo, pageSize, sortDir = 'ASC', filterKey = '', searchKey = '', status = '') => {
  try {
    let url = `${API_URL.ACTIVITY_DEFINITION}?application=PEM&sortDir=${sortDir}&pageNo=${pageNo}&pageSize=${pageSize}`;

    if (filterKey && searchKey) {
      url += `&${filterKey}=${searchKey}`;
    }
    if (status != '') {
      url += `&status=${status}`
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return { content: [], pageContent: {} };
    }

    const jsonData = await response.json();

    const customizedData = jsonData.content.map((e) => ({
      id: e.activityDefnKey,
      ...e
    }));

    return {
      content: customizedData,
      pageContent: jsonData.pageContent
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};
