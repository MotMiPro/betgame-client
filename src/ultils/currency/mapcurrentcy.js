import parseCurrency from "./parseCurrency";

const parseCurrencyHelper = (arr) => {
  return arr.reduce((arr, item) => {
    item.amount = parseCurrency(item.amount);
    arr.push({ ...item });
    return arr;
  }, []);
};
export default parseCurrencyHelper;
