import { Link, useParams } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import MetaData from "../Layout/MetaData";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../redux/api/orderApi";
import { ImPrinter } from "react-icons/im";

const ProcessOrder = () => {
  const [status, setStatus] = useState();
  const params = useParams();
  const { data } = useOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  const [updateOrder, { error, isSuccess }] = useUpdateOrderMutation();

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
  } = order;

  useEffect(() => {
    if (orderStatus) setStatus(orderStatus);
  }, [orderStatus]);

  useEffect(() => {
    if (error) toast.error(error?.data?.message);

    if (isSuccess) toast.success("Order Updated.");
  }, [error, isSuccess]);

  const updateOrderHandler = (id) => {
    const data = { status };
    updateOrder({ id, body: data });
  };

  return (
    <AdminLayout>
      <MetaData title="Process Order" />
      <div className="flex flex-wrap justify-around">
        {/* Left Section - Order Details */}
        <div className="w-full lg:w-8/12 px-4">
          <h3 className="mt-12 mb-6 text-2xl font-semibold">Order Details</h3>
          <table className="w-full table-auto border border-gray-300">
            <tbody>
              <tr className="border">
                <th className="px-4 py-2 text-left border">ID</th>
                <td className="px-4 py-2 border">{order?._id}</td>
              </tr>
              <tr className="border">
                <th className="px-4 py-2 text-left border">Status</th>
                <td
                  className={`px-4 py-2 font-bold ${
                    String(orderStatus).includes("Delivered") ||
                    String(orderStatus).includes("Shipped")
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order?.orderStatus}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-12 mb-6 text-2xl font-semibold">Shipping Info</h3>
          <table className="w-full table-auto border border-gray-300">
            <tbody>
              <tr className="border">
                <th className="px-4 py-2 text-left border">Name</th>
                <td className="px-4 py-2 border">{user?.name}</td>
              </tr>
              <tr className="border">
                <th className="px-4 py-2 text-left border">Phone No</th>
                <td className="px-4 py-2 border">{shippingInfo?.phoneNo}</td>
              </tr>
              <tr className="border">
                <th className="px-4 py-2 text-left border">Address</th>
                <td className="px-4 py-2 border">{`${shippingInfo?.address}, ${shippingInfo?.city}, ${shippingInfo?.zipCode}, ${shippingInfo?.country}`}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-12 mb-6 text-2xl font-semibold">Payment Info</h3>
          <table className="w-full table-auto border border-gray-300">
            <tbody>
              <tr className="border">
                <th className="px-4 py-2 text-left border">Status</th>
                <td
                  className={`px-4 py-2 font-bold ${
                    paymentInfo?.status === "paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {paymentInfo?.status.toUpperCase() || "N/A"}
                </td>
              </tr>
              <tr className="border">
                <th className="px-4 py-2 text-left border">Method</th>
                <td className="px-4 py-2 border">{order?.paymentMethod}</td>
              </tr>
              <tr className="border">
                <th className="px-4 py-2 text-left border">Stripe ID</th>
                <td className="px-4 py-2 border">
                  {paymentInfo?.id || "Nill"}
                </td>
              </tr>
              <tr className="border">
                <th className="px-4 py-2 text-left border">Amount</th>
                <td className="px-4 py-2 border">${totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-12 mb-4 text-2xl font-semibold">Order Items:</h3>
          <hr className="border-gray-300" />

          <div className="my-5">
            {orderItems?.map((item) => (
              <div
                key={item?.product}
                className="flex flex-wrap items-center space-y-4 lg:space-y-0 lg:space-x-6"
              >
                <div className="w-1/4 lg:w-1/6">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    className="w-16 h-auto"
                  />
                </div>
                <div className="w-1/2 lg:w-5/12">
                  <Link
                    to={`/product/${item?.product}`}
                    className="text-blue-600 hover:underline"
                  >
                    {item?.name}
                  </Link>
                </div>
                <div className="w-1/4 lg:w-1/6 mt-2 lg:mt-0 font-semibold">
                  <p>${item?.price}</p>
                </div>
                <div className="w-1/4 lg:w-1/4 mt-2 lg:mt-0">
                  <p>{item?.quantity} Piece(s)</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-gray-300" />
        </div>

        {/* Right Section - Status + Actions */}
        <div className="w-full lg:w-1/4 mt-12 px-4">
          <h4 className="text-xl font-semibold mb-4">Status</h4>

          <div className="mb-4">
            <select
              name="status"
              className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mb-6"
            onClick={() => updateOrderHandler(order?._id)}
          >
            Update Status
          </button>

          <h4 className="text-xl font-semibold mb-3">Order Invoice</h4>
          <Link
            to={`/invoice/orders/${order?._id}`}
            className="w-full text-center py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <ImPrinter size={22} className="text-white" />
            Generate Invoice
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProcessOrder;
