"use client";

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
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Funcție pentru a formata o dată în format YYYY-MM-DD
const formatDate = (date) => date.toISOString().split("T")[0];

export default function StatisticsChart({ rezervari }) {
  // Calculăm ultimele 7 zile (inclusiv azi)
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(formatDate(d));
  }

  // Agregăm rezervările pe zile (folosind data din slot.start)
  const countsByDay = useMemo(() => {
    const counts = {};
    days.forEach((day) => {
      counts[day] = 0;
    });
    rezervari.forEach((reservation) => {
      if (reservation.slot && reservation.slot.start) {
        // Extragem data (partea dinainte de "T")
        const resDate = reservation.slot.start.split("T")[0];
        if (counts.hasOwnProperty(resDate)) {
          counts[resDate] += 1;
        }
      }
    });
    return days.map(day => counts[day]);
  }, [rezervari, days]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Rezervări în ultimele 7 zile",
      },
    },
  };

  const data = {
    labels: days,
    datasets: [
      {
        label: "Număr rezervări",
        data: countsByDay,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
