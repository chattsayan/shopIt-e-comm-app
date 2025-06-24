import { useEffect, useState } from "react";
import MetaData from "../Layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../utils/helpers";
import {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
} from "../../redux/api/orderApi";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [createNewOrder, { error, isSuccess }] = useCreateNewOrderMutation();

  const [
    stripeCheckoutSession,
    { data: checkOutData, error: checkOutError, isLoading },
  ] = useStripeCheckoutSessionMutation();

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateOrderCost(cartItems);

  useEffect(() => {
    if (checkOutData) {
      window.location.href = checkOutData?.url;
    }

    if (checkOutError) {
      toast.error(
        checkOutError?.data?.message || "Failed to create checkout session"
      );
    }
  }, [checkOutData, checkOutError]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to create order");
    }

    if (isSuccess) {
      toast.success("Order created successfully");
      navigate("/");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (paymentMethod === "Card") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
      };

      stripeCheckoutSession(orderData);
    }

    if (paymentMethod === "COD") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: { status: "Not Paid" },
        paymentMethod: "COD",
      };

      createNewOrder(orderData);
    }
  };

  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckoutSteps />
      <div className="flex items-center justify-center min-h-[55vh] py-8 px-2">
        <div className="w-full max-w-md rounded-xl shadow-lg p-8">
          <form onSubmit={submitHandler}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
              Select Payment Method
            </h2>

            <div className="mb-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment_mode"
                  id="codradio"
                  value="COD"
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-blue-500 w-5 h-5"
                  required
                />
                <span className="text-gray-700 font-medium">
                  Cash on Delivery
                </span>
              </label>
            </div>
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment_mode"
                  id="cardradio"
                  value="Card"
                  onChange={() => setPaymentMethod("Card")}
                  className="accent-blue-500 w-5 h-5"
                />
                <span className="text-gray-700 font-medium">
                  Card - VISA, MasterCard
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
