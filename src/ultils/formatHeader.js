export const withHeader = (token) => {
  return {
    query: { accessToken: `Bearer ${token}` },
  };
};
