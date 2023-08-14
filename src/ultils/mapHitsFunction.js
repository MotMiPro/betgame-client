export const mapHits = (hits, numbers) => {
  let results = [];
  for (let i = 0; i < hits.length; i++) {
    let result = [];
    // if (i < hits.length) {
    for (let j = 0; j < 3; j++) {
      if (hits[i][j] == false || undefined) {
        result.push(6);
      } else {
        result.push(numbers[i][j]);
      }
    }
    results.push(result);
  }
  return results;
};
