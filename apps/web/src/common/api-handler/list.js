class ListAPIHandler {
  static handleResponse(response, itemKey) {
    if (response.status === 200) {
      const contentRange = response.headers['content-range'];
      const paginationData = parseContentRange(contentRange);
      response.data.forEach((item) => {
        item.id = item[itemKey];
      });
      response.data = {
        data: response.data,
        meta: {
          ...paginationData
        }
      };
    }
  }
  static handleRequest(request) {}
}

function parseContentRange(contentRangeHeader) {
  if (contentRangeHeader) {
    const regex = /items (\d+)-(\d+)\/(\d+)/;
    const match = contentRangeHeader.match(regex);

    if (match) {
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);
      const totalItems = parseInt(match[3], 10);
      const pageSize = end - start + 1;
      const pageNumber = Math.floor(start / pageSize) + 1;

      return { start, end, totalItems, pageSize, pageNumber };
    }
  }

  return {};
}

export default ListAPIHandler;
