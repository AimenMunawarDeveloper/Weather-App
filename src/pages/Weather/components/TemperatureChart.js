import { Line } from "react-chartjs-2";
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export const LineChart = ({ temperatureData, labels }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Max Temperature (°C)",
        backgroundColor: "#021526",
        borderColor: "#021526",
        data: temperatureData,
      },
    ],
  };
  return (
    <div style={{ width: "100%", height: "400px" }} className="mb-5">
      <Line data={data} />
    </div>
  );
};
