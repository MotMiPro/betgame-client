export function playDiceGameDemo(
  balance,
  target,
  isRollOver,
  amount,
  multiplier
) {
  try {
    let roll = Math.floor(Math.random() * 10000) / 100;
    let isWin = false;
    let profit = -amount;
    if (isRollOver) {
      if (roll >= target) {
        profit = amount * multiplier;
        isWin = true;
      }
    } else {
      if (roll <= target) {
        profit = amount * multiplier;
        isWin = true;
      }
    }
    balance += profit;
    return { roll, isWin, profit, balance };
  } catch (err) {
    throw err;
  }
}
