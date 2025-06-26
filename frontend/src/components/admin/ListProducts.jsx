import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../Layout/Loader";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdFileUpload } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { TransactionsTable } from "../Layout/Table";
import MetaData from "../Layout/MetaData";
import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} from "../../redux/api/productApi";
import AdminLayout from "../Layout/AdminLayout";

const ListProducts = () => {
  const { data, error, isLoading } = useGetAdminProductsQuery();

  const [deleteProduct, { isDeleteLoading, error: deleteError, isSuccess }] =
    useDeleteProductMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Product deleted.");
    }
  }, [error, deleteError, isSuccess]);

  const deleteProductHandler = (id) => {
    deleteProduct(id);
  };

  // console.log("Products Data:", data);

  const headers = ["Order ID", "Name", "Stock", "Actions"];

  const rows = data?.product?.map((product) => ({
    orderid: product?._id,
    name: product?.name,
    stock: product?.stock,
    actions: (
      <div className="flex gap-3">
        <Link
          to={`/admin/products/${product?._id}`}
          className="border p-1 rounded-sm border-blue-400 hover:border-blue-500 bg-blue-400 hover:bg-blue-500"
        >
          <MdEdit size={20} className="text-white" />
        </Link>
        <Link
          to={`/admin/products/${product?._id}/upload_images`}
          className="border p-1 rounded-sm border-green-400 hover:border-green-500 bg-green-400 hover:bg-green-500"
        >
          <MdFileUpload size={20} className="text-white" />
        </Link>
        <button
          className="border p-1 rounded-sm border-red-400 hover:border-red-500 bg-red-400 hover:bg-red-500 cursor-pointer"
          disabled={isDeleteLoading}
          onClick={() => deleteProductHandler(product?._id)}
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
        <MetaData title="All Products" />
        <div>
          <h1 className="mx-10 text-3xl font-bold my-10">
            {data?.product?.length} Products
          </h1>
          <TransactionsTable rows={rows} headers={headers} />
        </div>
      </AdminLayout>
    </>
  );
};

export default ListProducts;
