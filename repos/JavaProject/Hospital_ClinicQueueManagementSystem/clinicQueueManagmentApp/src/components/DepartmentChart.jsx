import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./DepartmentChart.css";

export default function DepartmentChart() {
  const [data, setData] = useState([]);

  const fetchStats = async () => {
    const res = await axios.get(
      "http://localhost:8080/api/stats/department-counts"
    );
    const formatted = Object.entries(res.data).map(([key, value]) => ({
      department: key,
      count: value,
    }));
    setData(formatted);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Total Patients per Department</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
