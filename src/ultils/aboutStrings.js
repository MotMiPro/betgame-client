export const handleSplitString = (string) => {
  return `${string.substr(0, 10)}...${string.substr(
    string.length - 10,
    string.length
  )}`;
};
