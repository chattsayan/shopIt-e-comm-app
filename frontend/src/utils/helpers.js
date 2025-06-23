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

export const calculateOrderCost = (cartItems) => {
  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = (0.15 * itemsPrice).toFixed(2);
  const totalPrice = (itemsPrice + shippingPrice + Number(taxPrice)).toFixed(2);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
