// const parseCurrency = (money, unit = "USDT") =>
//   money !== null && money !== undefined
//     ? parseFloat(money).toFixed(3).toLocaleString("en-GB")
//     : "";

// export default parseCurrency;
const parseCurrency = (number, decimals = 3) => {
  if (isNaN(number)) return 0;
  if (!decimals) decimals = 0;
  return Math.round(number * 1000) / 1000;
  // return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export default parseCurrency;

export function getFixedNumber(num, fixed = 4) {
  if (num === 0) return 0;
  const parseNumToString = num.toString();
  const newNum = parseNumToString.slice(
    0,
    parseNumToString.indexOf(".") + fixed
  );
  return Number(newNum);
}
