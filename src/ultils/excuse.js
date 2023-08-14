export const flatNumber = (arr) => {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(
      Array.isArray(toFlatten) ? flatNumber(toFlatten) : `${toFlatten}`
    );
  }, []);
};

const turnClassName = (status) => {
  return status ? "coin-active" : "coin-current";
};

const tempArr = [
  { num: 0, class: `coin-current` },
  { num: 1, class: `coin-current` },
  { num: 2, class: `coin-current` },
  { num: 3, class: `coin-current` },
  { num: 4, class: `coin-current` },
  { num: 5, class: `coin-current` },
];

const tempHighLight = [false, false, false];

export const parseArr = async (arr, highLights) => {
  const addArr =
    highLights.length === 1
      ? [tempHighLight, ...highLights, tempHighLight]
      : highLights.length === 2
      ? [...highLights, tempHighLight]
      : highLights;
  const left = await [
    { num: arr[0][0], class: turnClassName(addArr[0][0] ?? false) },
    { num: arr[1][0], class: turnClassName(addArr[1][0] ?? false) },
    { num: arr[2][0], class: turnClassName(addArr[2][0] ?? false) },
    ...tempArr,
  ];
  const center = await [
    { num: arr[0][1], class: turnClassName(addArr[0][1] ?? false) },
    { num: arr[1][1], class: turnClassName(addArr[1][1] ?? false) },
    { num: arr[2][1], class: turnClassName(addArr[2][1] ?? false) },
    ...tempArr,
  ];
  const right = await [
    { num: arr[0][2], class: turnClassName(addArr[0][2] ?? false) },
    { num: arr[1][2], class: turnClassName(addArr[1][2] ?? false) },
    { num: arr[2][2], class: turnClassName(addArr[2][2] ?? false) },
    ...tempArr,
  ];
  return [left, center, right];
};
