export const addingToTable = (localArr, data, isDataArr = false) => {
  const copyArr = JSON.parse(JSON.stringify(localArr)) || [];
  copyArr.length >= 10 ? copyArr.splice(-1, 1) : copyArr;
  if (isDataArr) {
    if (data?.length > 1) {
      if (data?.length > 10) {
        const slicedArray = data.slice(0, 10);
        return slicedArray;
      }
      return data;
    }
    if (data?.length === 1) {
      return [data[0], ...copyArr];
    }
    return [...copyArr];
  } else return [data, ...copyArr];
};
