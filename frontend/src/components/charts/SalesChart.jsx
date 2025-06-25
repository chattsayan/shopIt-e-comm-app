import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const SalesChart = ({ salesData }) => {
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Sales and Orders Data",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const labels = salesData?.map((data) => data?.date);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: salesData?.map((data) => data?.sales),
        borderColor: "#15803d",
        backgroundColor: "rgba(42, 117, 83, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: salesData?.map((data) => data?.numOrders),
        borderColor: "#b91c1c",
        backgroundColor: "rgba(201, 68, 82, 0.5)",
        yAxisID: "y1",
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default SalesChart;
