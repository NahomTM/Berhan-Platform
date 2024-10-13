import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart } from "chart.js/auto";

const InstLineChart2 = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        const examResponse = await axios.get(
          "http://localhost:4000/exam/getLineExam",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
            },
          }
        );
        const userData = examResponse.data;

        const employeeCountByDay = userData.reduce((acc, user) => {
          const createdAt = new Date(user.createdAt);
          const day = createdAt.toLocaleDateString("default"); // Get day in format MM/DD/YYYY
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(employeeCountByDay).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        const data = Object.values(employeeCountByDay);

        const uploadResponse = await axios.get(
          "http://localhost:4000/api/getUploads",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
            },
          }
        );

        const uploads = uploadResponse.data;
        const uploadsCountByDay = uploads.reduce((acc, user) => {
          const createdAt = new Date(user.createdAt);
          const day = createdAt.toLocaleDateString("default"); // Get day in format MM/DD/YYYY
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

        const uploadLabels = Object.keys(uploadsCountByDay).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        const uploadData = Object.values(uploadsCountByDay);

        console.log("labels: ", labels);
        console.log("uploadLabels: ", uploadLabels);

        setChartData({
          labels: labels, // Using the sorted labels
          datasets: [
            {
              label: "Exams Created",
              data: data,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
            {
              label: "Materials Uploaded",
              data: uploadData,
              fill: false,
              borderColor: "rgb(54, 162, 235)",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: chartData.labels || [], // Ensuring labels are initialized
    datasets: chartData.datasets
      ? chartData.datasets.map((dataset, index) => ({
          label: dataset.label,
          data: dataset.data,
          pointBackgroundColor: index === 0 ? "rgba(255, 99, 132, 0.2)" : "rgba(54, 162, 235, 0.2)",
          pointBorderColor: index === 0 ? "rgba(255, 99, 132, 0.2)" : "rgba(54, 162, 235, 0.2)",
          pointRadius: 5,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        }))
      : [],
  };

  const options = {
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 20, // Add bottom margin
      },
    },
    scales: {
      x: {
        ticks: {
          padding: 10, // Adjust the padding to your preference
          align: "start", // Align the labels to the left
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Increment y-axis labels by 1
        },
      },
    },
    legend: {
      labels: {
        fontSize: 25,
      },
    },
  };

  return (
    <div>
      {chartData.labels && chartData.datasets && (
        <Line data={data} height={400} options={options} />
      )}
    </div>
  );
};

export default InstLineChart2;
