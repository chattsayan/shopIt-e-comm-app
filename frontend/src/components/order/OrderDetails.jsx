import { useEffect } from "react";
import MetaData from "../Layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../Layout/Loader";
import { LiaFileInvoiceSolid } from "react-icons/lia";

const OrderDetails = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
  } = order;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="Order Details" />
      <div className="flex flex-col items-center w-full px-2 sm:px-4 py-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            <Link
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
              to={`/invoice/orders/${order?._id}`}
            >
              <LiaFileInvoiceSolid size={20} />
              <span>Invoice</span>
            </Link>
          </div>

          {/* Order Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Order Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded p-4 flex items-center gap-2">
                <span className="font-medium text-gray-600">Order ID:</span>
                <div className="text-gray-800 break-all font-bold">
                  {order?._id}
                </div>
              </div>
              <div className="bg-gray-100 rounded p-4">
                <span className="font-medium text-gray-600">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                    String(orderStatus).includes("Delivered")
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {orderStatus.toUpperCase()}
                </span>
              </div>
              <div className="bg-gray-100 rounded p-4 flex items-center gap-2">
                <span className="font-medium text-gray-600">Date:</span>
                <div className="text-gray-800 font-bold">
                  {order?.createdAt
                    ? new Date(order?.createdAt).toLocaleString("en-US")
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Shipping Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded p-4 flex items-center gap-2">
                <span className="font-medium text-gray-600">Name:</span>
                <div className="text-gray-800 font-bold">{user.name}</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex items-center gap-2">
                <span className="font-medium text-gray-600">Phone No:</span>
                <div className="text-gray-800 font-bold">
                  {shippingInfo?.phoneNo}
                </div>
              </div>
              <div className="bg-gray-100 rounded p-4 md:col-span-2 flex items-center gap-2">
                <span className="font-medium text-gray-600">Address:</span>
                <div className="text-gray-800 font-bold">
                  {`${shippingInfo?.address}, ${shippingInfo?.city}, ${shippingInfo?.zipCode}, ${shippingInfo?.country}`}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Payment Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded p-4">
                <span className="font-medium text-gray-600">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                    paymentInfo?.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {paymentInfo?.status.toUpperCase() || "N/A"}
                </span>
              </div>
              <div className="bg-gray-100 rounded p-4 flex items-center gap-2">
                <span className="font-medium text-gray-600">Method:</span>
                <div className="text-gray-800 font-bold">
                  {order?.paymentMethod}
                </div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex items-center gap-2">
                <span className="font-medium text-gray-600">Stripe ID:</span>
                <div className="text-gray-800 font-bold">
                  {paymentInfo?.id || "Nill"}
                </div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex items-center gap-2">
                <span className="font-medium text-gray-600">Amount Paid:</span>
                <div className="text-gray-800 font-bold">${totalAmount}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Order Items
            </h3>

            <div className="divide-y divide-gray-200">
              {orderItems?.map((item, idx) => (
                <div
                  key={item.product || idx}
                  className="flex flex-row items-center py-4 gap-4"
                >
                  <img
                    src={item?.image}
                    alt={item?.name}
                    className="w-20 h-20 object-contain flex-shrink-0"
                  />
                  <div className="flex-1 px-2 text-center sm:text-left">
                    <Link
                      to={`/products/${item?.product}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item?.name}
                    </Link>
                  </div>
                  <div className="flex flex-col items-end min-w-[80px]">
                    <span className="font-semibold text-gray-700">
                      ${item?.price}
                    </span>
                    <span className="font-semibold text-gray-700">
                      {item?.quantity} Piece(s)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
