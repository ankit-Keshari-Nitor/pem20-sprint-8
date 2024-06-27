export const validationQuery = (query) => {
  const { rules, id, ...rest } = query;
  const rulesData = rules.map((item) => {
    if (item?.rules) {
      return {
        group: validationQuery(item)
      };
    } else {
      return {
        rule: {
          datatype: item.field,
          lhs: Array.isArray(item.operator) ? item.operator[0] : '',
          operator: Array.isArray(item.operator) ? item.operator[1] : item.operator,
          rhs: item.value
        }
      };
    }
  });
  return {
    ...rest,
    rules: rulesData
  };
};
