export const validationQuery = (query) => {
  const { rules, id, ...rest } = query;
  const rulesData = rules.map((item) => {
    if (item?.rules) {
      return validationQuery(item);
    } else {
      return {
        datatype: item.field,
        lhs: Array.isArray(item.operator) ? item.operator[0] : '',
        operator: Array.isArray(item.operator) ? item.operator[1] : item.operator,
        rhs: item.value
      };
    }
  });
  return {
    ...rest,
    rules: rulesData
  };
};
