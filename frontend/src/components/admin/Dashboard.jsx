import { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SalesChart from "../charts/SalesChart";
import { useLazyGetDashboardSalesQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../Layout/Loader";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date());

  const [getDashboardSales, { error, isLoading, data }] =
    useLazyGetDashboardSalesQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (startDate && endDate && !data) {
      getDashboardSales({
        startDate: new Date(startDate).toISOString(),
        endDate: endDate.toISOString(),
      });
    }
  }, [error]);

  const submitHandler = () => {
    getDashboardSales({
      startDate: new Date(startDate).toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-start">
        <div className="mb-3 mr-4">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <button
          className="ml-4 mt-3 px-8 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 cursor-pointer"
          onClick={submitHandler}
        >
          Fetch
        </button>
      </div>

      <div className="flex flex-wrap pr-4 my-10">
        {/* Sales Card */}
        <div className="w-full xl:w-1/2 mb-3 px-2">
          <div className="bg-green-700 text-white rounded shadow h-full">
            <div className="p-6">
              <div className="text-center text-lg font-semibold">
                Sales
                <br />
                <b>${data?.totalSales.toFixed(2)}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="w-full xl:w-1/2 mb-3 px-2">
          <div className="bg-red-700 text-white rounded shadow h-full">
            <div className="p-6">
              <div className="text-center text-lg font-semibold">
                Orders
                <br />
                <b>{data?.totalNumOrders}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SalesChart salesData={data?.sales} />

      <div className="mb-5"></div>
    </AdminLayout>
  );
};

export default Dashboard;
