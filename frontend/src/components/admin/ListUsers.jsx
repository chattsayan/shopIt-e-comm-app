import { Link } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import MetaData from "../Layout/MetaData";
import Loader from "../Layout/Loader";
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { TransactionsTable } from "../Layout/Table";
import {
  useDeleteUserMutation,
  useGetAdminUsersQuery,
} from "../../redux/api/userApi";

const ListUsers = () => {
  const { data, error, isLoading } = useGetAdminUsersQuery();

  const [
    deleteUser,
    { error: deleteError, isSuccess, isLoading: isDeleteLoading },
  ] = useDeleteUserMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);

    if (deleteError) toast.error(deleteError?.data?.message);

    if (isSuccess) toast.success("User deleted.");
  }, [error, deleteError, isSuccess]);

  const deleteUserHandler = (id) => {
    deleteUser(id);
  };

  const headers = ["User ID", "Name", "Email", "Role", "Actions"];

  const rows = data?.users?.map((user) => ({
    userid: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    actions: (
      <div className="flex gap-3">
        <Link
          to={`/admin/users/${user?._id}`}
          className="border p-1 rounded-sm border-blue-400 hover:border-blue-500 bg-blue-400 hover:bg-blue-500"
        >
          <MdEdit size={20} className="text-white" />
        </Link>

        <button
          className="border p-1 rounded-sm border-red-400 hover:border-red-500 bg-red-400 hover:bg-red-500 cursor-pointer"
          disabled={isDeleteLoading}
          onClick={() => deleteUserHandler(user._id)}
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
        <MetaData title="All Users" />
        <div>
          <h1 className="mx-10 text-3xl font-bold my-10">
            {data?.users?.length} Users
          </h1>
          <TransactionsTable rows={rows} headers={headers} />
        </div>
      </AdminLayout>
    </>
  );
};

export default ListUsers;
