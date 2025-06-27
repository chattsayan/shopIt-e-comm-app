import { Link } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import MetaData from "../Layout/MetaData";
import Loader from "../Layout/Loader";
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  useAdminOrdersQuery,
  useDeleteOrderMutation,
} from "../../redux/api/orderApi";
import { TransactionsTable } from "../Layout/Table";

const ListOrders = () => {
  const { data, error, isLoading } = useAdminOrdersQuery();

  const [
    deleteOrder,
    { isLoading: isDeleteLoading, error: deleteError, isSuccess },
  ] = useDeleteOrderMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);

    if (deleteError) toast.error(deleteError?.data?.message);

    if (isSuccess) toast.success("Order deleted.");
  }, [error, deleteError, isSuccess]);

  const deleteOrderHandler = (id) => {
    deleteOrder(id);
  };

  const headers = ["Order ID", "Payment Status", "Order Status", "Actions"];

  const rows = data?.orders?.map((order) => ({
    orderid: order?._id,
    paymentstatus: order?.paymentInfo?.status?.toUpperCase(),
    orderstatus: order?.orderStatus,
    actions: (
      <div className="flex gap-3">
        <Link
          to={`/admin/orders/${order?._id}`}
          className="border p-1 rounded-sm border-blue-400 hover:border-blue-500 bg-blue-400 hover:bg-blue-500"
        >
          <MdEdit size={20} className="text-white" />
        </Link>

        <button
          className="border p-1 rounded-sm border-red-400 hover:border-red-500 bg-red-400 hover:bg-red-500 cursor-pointer"
          disabled={isDeleteLoading}
          onClick={() => deleteOrderHandler(order._id)}
        >
          <IoMdTrash size={20} className="text-white" />
        </button>
      </div>
    ),
  }));

  if (isLoading) return <Loader />;

  return (
    <>
      <AdminLayout>
        <MetaData title="All Orders" />
        <div>
          <h1 className="mx-10 text-3xl font-bold my-10">
            {data?.orders?.length} Orders
          </h1>
          <TransactionsTable rows={rows} headers={headers} />
        </div>
      </AdminLayout>
    </>
  );
};

export default ListOrders;
