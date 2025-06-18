export const getPriceQueryParams = (searchParams, key, value) => {
  const hasValueParams = searchParams.has(key);

  if (value && hasValueParams) {
    searchParams.set(key, value);
  } else if (value) {
    searchParams.append(key, value);
  } else if (hasValueParams) {
    searchParams.delete(key);
  }

  return searchParams;
};
