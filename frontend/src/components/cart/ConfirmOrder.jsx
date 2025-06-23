import { Link, useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../utils/helpers";
import CheckoutSteps from "./CheckoutSteps";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateOrderCost(cartItems);

  const proceedToPayment = () => navigate("/payment_method");

  return (
    <>
      <MetaData title={"Confirm Order Info"} />
      <CheckoutSteps />

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left: Shipping Info & Cart Items */}
        <div className="flex-1">
          <div className="p-6 mb-6">
            <h4 className="text-xl font-bold mb-4">Shipping Info</h4>

            <div className="space-y-2 text-gray-700">
              <div>
                <span className="font-semibold">Name:</span> {user?.name}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {shippingInfo?.phoneNo}
              </div>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                {shippingInfo?.address}, {shippingInfo?.city},{" "}
                {shippingInfo?.zipCode}, {shippingInfo?.country}
              </div>
            </div>
            <hr className="mt-4" />
          </div>
          <div className="p-6">
            <h4 className="text-xl font-bold mb-4">Your Cart Items</h4>
            <div className="divide-y">
              {cartItems?.map((item) => (
                <div
                  key={item.product}
                  className="flex flex-row items-center gap-2 py-4"
                >
                  {/* Image on left */}
                  <img
                    src={item?.image}
                    alt={item?.name}
                    className="w-16 h-14 object-contain rounded flex-shrink-0"
                  />
                  {/* Name in middle */}
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <Link
                      to={`/product/${item?.product}`}
                      className="text-base font-semibold text-gray-800 hover:text-orange-500 transition"
                    >
                      {item?.name}
                    </Link>
                  </div>
                  {/* Price on right (quantity x price = total) */}
                  <div className="text-gray-700 font-medium text-right min-w-[110px]">
                    {item?.quantity} x ${item?.price} =
                    <span className="font-semibold text-gray-800">
                      ${(item?.quantity * item?.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Order Summary */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg border border-gray-400 h-fit p-5">
          <h4 className="text-xl font-bold mb-4">Order Summary</h4>
          <hr className="mb-4 border-gray-400" />
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span className="font-semibold">${itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span className="font-semibold">${shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Tax:</span>
            <span className="font-semibold">${taxPrice}</span>
          </div>
          <hr className="mb-4 border-gray-400" />
          <div className="flex justify-between mb-4 text-lg">
            <span>Total:</span>
            <span className="font-bold">${totalPrice}</span>
          </div>
          <button
            className="w-full py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold mt-2 cursor-pointer"
            onClick={proceedToPayment}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
