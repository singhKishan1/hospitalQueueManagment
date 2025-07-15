import React, { useState, useEffect } from "react";
import axios from "axios";
import DepartmentChart from "./DepartmentChart";
import "./AdminDashboard.css";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [department, setDepartment] = useState("General");
  const [queues, setQueues] = useState({
    WAITING: [],
    CALLED: [],
    SERVED: [],
    CANCELLED: [],
  });
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("queue");

  const token = localStorage.getItem("token");

  const fetchQueues = async () => {
    try {
      const statuses = ["WAITING", "CALLED", "SERVED", "CANCELLED"];
      const all = await Promise.all(
        statuses.map((status) =>
          axios
            .get(
              `http://localhost:8080/api/admin/queue/${department}/${status}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then((res) => ({ status, data: res.data }))
        )
      );

      const newQueues = {};
      all.forEach(({ status, data }) => {
        newQueues[status] = data;
      });
      setQueues(newQueues);
    } catch (err) {
      console.error("Failed to fetch queues:", err);
    }
  };

  const callNext = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/admin/queue/next/${department}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      fetchQueues();
    } catch (err) {
      console.error("Failed to call next patient:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/queue/status/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Patient updated to ${newStatus}`);
      fetchQueues();
    } catch (err) {
      console.error(`Failed to update status to ${newStatus}:`, err);
    }
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 10000);
    return () => clearInterval(interval);
  }, [department]);

  const renderQueueSection = (title, status, showActions = false) => (
    <div className="queue-section">
      <h3 className="queue-status-title">
        {title} <span className="badge">{queues[status]?.length || 0}</span>
      </h3>
      <ul className="queue-list">
        {queues[status]?.length === 0 ? (
          <li className="queue-item empty">No patients</li>
        ) : (
          queues[status].map((entry) => (
            <li key={entry.id} className="queue-item">
              <div>
                <strong>#{entry.queueNumber}</strong> - {entry.patient.name} (
                {entry.patient.age} yrs)
              </div>
              {showActions && (
                <div className="action-buttons">
                  <button
                    className="serve-btn"
                    onClick={() => updateStatus(entry.id, "SERVED")}
                  >
                    Serve
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => updateStatus(entry.id, "CANCELLED")}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        📋 Admin Dashboard - {department} Department
      </h2>

      <div className="dashboard-controls">
        <select
          className="dept-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="General">General</option>
          <option value="ENT">ENT</option>
          <option value="Ortho">Ortho</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>
        <button className="call-button" onClick={callNext}>
          📣 Call Next Patient
        </button>
      </div>

      <div className="tab-selector">
        <button
          className={`tab-button ${activeTab === "queue" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("queue")}
        >
          📑 Queue View
        </button>
        <button
          className={`tab-button ${activeTab === "chart" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("chart")}
        >
          📊 Statistics
        </button>
      </div>

      {message && <div className="info-message">{message}</div>}

      <AnimatePresence mode="wait">
        {activeTab === "queue" ? (
          <motion.div
            key="queue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="queue-columns">
              {renderQueueSection("🕒 Waiting Patients", "WAITING", true)}
              {renderQueueSection("📢 Called Patients", "CALLED")}
              {renderQueueSection("✅ Served Patients", "SERVED")}
              {renderQueueSection("❌ Cancelled Patients", "CANCELLED")}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="dashboard-chart-section">
              <h3 className="chart-title">📊 Department-wise Patient Load</h3>
              <DepartmentChart />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
