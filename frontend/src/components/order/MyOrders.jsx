import { useEffect } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../Layout/Loader";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GrFormView } from "react-icons/gr";
import { TransactionsTable } from "../Layout/Table";
import { FaFilePdf } from "react-icons/fa6";
import MetaData from "../Layout/MetaData";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slice/cartSlice";

const MyOrders = () => {
  const { data, error, isLoading } = useMyOrdersQuery();
  const [searchParams] = useSearchParams();
  const orderSuccess = searchParams.get("order_success");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (orderSuccess) {
      dispatch(clearCart());
      navigate("/me/orders");
    }
  }, [error, orderSuccess]);

  const headers = [
    "Order ID",
    "Amount",
    "Payment Status",
    "Order Status",
    "Actions",
  ];

  const rows = data?.orders?.map((order) => ({
    orderid: order?._id,
    amount: `$${order?.totalAmount}`,
    paymentstatus: order?.paymentInfo?.status?.toUpperCase(),
    orderstatus: order?.orderStatus,
    actions: (
      <div className="flex gap-3">
        <Link
          to={`/me/orders/${order?._id}`}
          className="border p-1 rounded-sm border-blue-400 hover:border-blue-500 bg-blue-400 hover:bg-blue-500"
        >
          <GrFormView size={20} className="text-white" />
        </Link>
        <Link
          to={`/invoice/orders/${order?._id}`}
          className="border p-1 rounded-sm border-green-400 hover:border-green-500 bg-green-400 hover:bg-green-500"
        >
          <FaFilePdf size={20} className="text-white" />
        </Link>
      </div>
    ),
  }));

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="My Orders" />
      <div>
        <h1 className="mx-10 text-3xl font-bold my-10">
          {data?.orders?.length} Orders
        </h1>
        <TransactionsTable rows={rows} headers={headers} />
      </div>
    </>
  );
};

export default MyOrders;
