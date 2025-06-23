import { useDispatch, useSelector } from "react-redux";
import MetaData from "../Layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setCartItem, removeCartItem } from "../../redux/slice/cartSlice";
import { RiDeleteBin2Fill } from "react-icons/ri";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const decreaseQty = (item, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;
    setItemToCart(item, newQty);
    toast.success("Item removed from cart");
  };

  const increaseQty = (item, quantity) => {
    const newQty = quantity + 1;
    if (newQty > item?.stock) return;
    setItemToCart(item, newQty);
    toast.success("Item added to cart");
  };

  const setItemToCart = (item, newQty) => {
    const cartItem = {
      product: item?.product,
      name: item?.name,
      price: item?.price,
      image: item?.image,
      stock: item?.stock,
      quantity: newQty,
    };
    dispatch(setCartItem(cartItem));
  };

  const removeItemFromCart = (id) => {
    dispatch(removeCartItem(id));
    toast.success("Item removed from cart");
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  // Calculate subtotal and total units
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <MetaData title={"Your Cart"} />
      {cartItems?.length === 0 ? (
        <h2 className="mt-10 text-center text-2xl font-semibold">
          Your Cart is empty.
        </h2>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">
            Your Cart: <b>{totalUnits} items</b>
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              {cartItems?.map((item) => (
                <div
                  key={item.product}
                  className="py-6 border-b last:border-b-0"
                >
                  {/* Responsive row: image | (name+price or price) | qty+delete */}
                  <div className="flex flex-row items-center gap-2 w-full">
                    {/* Image on left always */}
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="w-20 h-16 object-contain rounded flex-shrink-0"
                    />
                    {/* Middle: price (sm), name+price (md+) */}
                    <div className="flex-1 flex flex-col md:items-center md:justify-center">
                      {/* On md+, show name and price stacked/centered */}
                      <div className="hidden md:flex flex-col items-center">
                        <Link
                          to={`/products/${item?.product}`}
                          className="text-base font-semibold text-gray-800 hover:text-orange-500 transition"
                        >
                          {item?.name}
                        </Link>
                        <p className="text-gray-800 font-semibold mt-1">
                          ${item?.price}
                        </p>
                      </div>
                      {/* On small screens, only show price here */}
                      <div className="md:hidden flex justify-center">
                        <p className="text-gray-800 font-semibold">
                          ${item?.price}
                        </p>
                      </div>
                    </div>
                    {/* Quantity controls and delete on right always */}
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        className="bg-red-500 text-white rounded-full px-2 hover:bg-red-600 transition cursor-pointer"
                        onClick={() => decreaseQty(item, item?.quantity)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-10 text-center py-1 border rounded"
                        value={item?.quantity}
                        readOnly
                      />
                      <button
                        className="bg-blue-500 text-white rounded-full px-2 hover:bg-blue-600 transition cursor-pointer"
                        onClick={() => increaseQty(item, item?.quantity)}
                      >
                        +
                      </button>
                      <button
                        className="ml-2 text-red-600 hover:text-red-800 transition cursor-pointer"
                        onClick={() => removeItemFromCart(item?.product)}
                      >
                        <RiDeleteBin2Fill size={18} />
                      </button>
                    </div>
                  </div>
                  {/* On small screens, name below row, centered */}
                  <div className="mt-2 text-center md:hidden">
                    <Link
                      to={`/products/${item?.product}`}
                      className="text-base font-semibold text-gray-800 hover:text-orange-500 transition"
                    >
                      {item?.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {/* Order Summary */}
            <div className="w-full lg:w-1/3 bg-white rounded-lg border border-gray-400 h-fit p-5">
              <h4 className="text-xl font-bold mb-4">Order Summary</h4>
              <hr className="mb-4 border-gray-400" />
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-semibold">{totalUnits} (Units)</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Est. total:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <hr className="mb-4 border-gray-400" />
              <button
                className="w-full py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold mt-2 cursor-pointer"
                onClick={checkoutHandler}
              >
                Check out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
