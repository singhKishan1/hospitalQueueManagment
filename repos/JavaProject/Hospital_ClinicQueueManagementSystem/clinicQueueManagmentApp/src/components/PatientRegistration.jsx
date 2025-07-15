import React, { useState } from "react";
import axios from "axios";
import "./PatientRegistration.css";

export default function PatientRegistration() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    department: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/patient/register",
        form
      );
      setResponse(res.data);
    } catch (err) {
      setError("Registration failed. Please try again." + err);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Patient Registration</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />

        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Department</option>
          <option value="General">General</option>
          <option value="ENT">ENT</option>
          <option value="Ortho">Ortho</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>

        <button type="submit" className="button">
          Register
        </button>
      </form>

      {response && (
        <div className="success-box">
          <p>✅ Registered Successfully!</p>
          <p>
            <strong>Department:</strong> {response.department}
          </p>
          <p>
            <strong>Your Queue Number:</strong> {response.queueNumber}
          </p>
          <p>
            <strong>Status:</strong> {response.status}
          </p>
        </div>
      )}

      {error && <div className="error-box">❌ {error}</div>}
    </div>
  );
}
