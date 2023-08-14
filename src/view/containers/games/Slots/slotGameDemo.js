const MAX_LINE = 3;
const MIN_LINE = 1;
const WEIGHT_LOGO = [1, 2, 3, 5, 9, 16]; //TOTAL: 36
const RESULT = [
  { numbers: [0, 0, 0], multiplier: 1000, hits: [true, true, true] },
  // x100
  { numbers: [1, 1, 1], multiplier: 100, hits: [true, true, true] },
  { numbers: [0, 1, 1], multiplier: 100, hits: [true, true, true] },
  { numbers: [1, 0, 1], multiplier: 100, hits: [true, true, true] },
  { numbers: [1, 1, 0], multiplier: 100, hits: [true, true, true] },
  { numbers: [0, 0, 1], multiplier: 100, hits: [true, true, true] },
  { numbers: [0, 1, 0], multiplier: 100, hits: [true, true, true] },
  { numbers: [1, 0, 0], multiplier: 100, hits: [true, true, true] },
  // x50
  { numbers: [2, 2, 2], multiplier: 50, hits: [true, true, true] },
  { numbers: [0, 2, 2], multiplier: 50, hits: [true, true, true] },
  { numbers: [2, 0, 2], multiplier: 50, hits: [true, true, true] },
  { numbers: [2, 2, 0], multiplier: 50, hits: [true, true, true] },
  { numbers: [0, 0, 2], multiplier: 50, hits: [true, true, true] },
  { numbers: [0, 2, 0], multiplier: 50, hits: [true, true, true] },
  { numbers: [2, 0, 0], multiplier: 50, hits: [true, true, true] },
  // x15
  { numbers: [3, 3, 3], multiplier: 15, hits: [true, true, true] },
  { numbers: [0, 3, 3], multiplier: 15, hits: [true, true, true] },
  { numbers: [3, 0, 3], multiplier: 15, hits: [true, true, true] },
  { numbers: [3, 3, 0], multiplier: 15, hits: [true, true, true] },
  { numbers: [0, 0, 3], multiplier: 15, hits: [true, true, true] },
  { numbers: [0, 3, 0], multiplier: 15, hits: [true, true, true] },
  { numbers: [3, 0, 0], multiplier: 15, hits: [true, true, true] },
  // x10
  { numbers: [1, 1, "x"], multiplier: 10, hits: [true, true, false] },
  { numbers: [1, "x", 1], multiplier: 10, hits: [true, false, true] },
  { numbers: ["x", 1, 1], multiplier: 10, hits: [false, true, true] },
  { numbers: [0, 0, "x"], multiplier: 10, hits: [true, true, false] },
  { numbers: [0, "x", 0], multiplier: 10, hits: [true, false, true] },
  { numbers: ["x", 0, 0], multiplier: 10, hits: [false, true, true] },
  // x5
  { numbers: [4, 4, 4], multiplier: 5, hits: [true, true, true] },
  { numbers: [0, 4, 4], multiplier: 5, hits: [true, true, true] },
  { numbers: [4, 0, 4], multiplier: 5, hits: [true, true, true] },
  { numbers: [4, 4, 0], multiplier: 5, hits: [true, true, true] },
  // x2
  { numbers: [5, 5, 5], multiplier: 2, hits: [true, true, true] },
  { numbers: [0, 5, 5], multiplier: 2, hits: [true, true, true] },
  { numbers: [5, 0, 5], multiplier: 2, hits: [true, true, true] },
  { numbers: [5, 5, 0], multiplier: 2, hits: [true, true, true] },
  // x1
  { numbers: [1, "x", "x"], multiplier: 1, hits: [true, false, false] },
  { numbers: ["x", 1, "x"], multiplier: 1, hits: [false, true, false] },
  { numbers: ["x", "x", 1], multiplier: 1, hits: [false, false, true] },
  { numbers: [0, "x", "x"], multiplier: 1, hits: [true, false, false] },
  { numbers: ["x", 0, "x"], multiplier: 1, hits: [false, true, false] },
  { numbers: ["x", "x", 0], multiplier: 1, hits: [false, false, true] },
];

export function playSLotsGameDemo(balance, amount, lines) {
  try {
    const { numbers } = generateNumbersSlot();
    const { hits, multipliers } = checkResultNumbers(numbers, lines);
    let multiplierTotal = 0;
    multipliers.map((item) => (multiplierTotal += item));
    let isWin = false;
    let profit = -amount * lines;
    if (multiplierTotal > 0) {
      isWin = true;
      profit = profit + amount * multiplierTotal;
    }
    balance += profit;
    return { numbers, hits, multipliers, isWin, profit, balance };
  } catch (err) {
    throw err;
  }
}

function generateNumbersSlot() {
  try {
    let numbersTotal = [];
    for (let i = 0; i < 3; i++) {
      let numbersLine = [];
      for (let j = 0; j < 3; j++) {
        let total = [];
        for (let k = 0; k < WEIGHT_LOGO.length; k++) {
          for (let l = 0; l < parseInt(10 * WEIGHT_LOGO[k]); l++) {
            total.push(k);
          }
        }

        let index = Math.floor(Math.random() * total.length);
        let chosenNumber = total[index];
        numbersLine.push(chosenNumber);
      }
      numbersTotal.push(numbersLine);
    }
    return { numbers: numbersTotal };
  } catch (err) {
    throw err;
  }
}

function checkResultNumbers(numbers, lines) {
  let hits = [];
  let multipliers = [];
  if (lines == 1) {
    let hit = [false, false, false];
    let multiplier = 0;
    for (let j = 0; j < RESULT.length; j++) {
      if (compareNumbers(numbers[1], RESULT[j].numbers)) {
        hit = RESULT[j].hits;
        multiplier = RESULT[j].multiplier;
        break;
      }
    }
    hits.push(hit);
    multipliers.push(multiplier);
  } else {
    for (let i = 0; i < lines; i++) {
      let hit = [false, false, false];
      let multiplier = 0;
      for (let j = 0; j < RESULT.length; j++) {
        if (compareNumbers(numbers[i], RESULT[j].numbers)) {
          hit = RESULT[j].hits;
          multiplier = RESULT[j].multiplier;
          break;
        }
      }
      hits.push(hit);
      multipliers.push(multiplier);
    }
  }
  return { numbers, hits, multipliers };
}

function compareNumbers(numbers1, numbers2) {
  let result = true;
  if (numbers1.length !== numbers2.length) return false;
  for (let i = 0; i < numbers1.length; i++) {
    if (numbers2[i] != "x" && numbers2[i] !== numbers1[i]) {
      result = false;
      break;
    }
  }
  return result;
}
