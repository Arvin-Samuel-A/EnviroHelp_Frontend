import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    role: "volunteer",
    image: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    fetch("http://localhost:3000/create_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.session_id);
        localStorage.setItem("role", data.role);

        if (data.role === "volunteer") {
          navigate("/volunteer");
        } else if (data.role === "campaigner") {
          navigate("/campaigner");
        } else {
          alert("Unknown role, redirecting to home.");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: "#2ecc71", minHeight: "100vh", width: "100vw" }}>
      <div className="col-md-6 col-lg-4">
        <div className="card signup-card shadow p-4" style={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "15px" }}>
          <h2 className="text-center mb-4">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="contact" className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">I want to join as:</label>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="role" id="volunteer" value="volunteer" checked={formData.role === "volunteer"} onChange={handleChange} />
                <label className="form-check-label" htmlFor="volunteer">Volunteer</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="role" id="campaigner" value="campaigner" checked={formData.role === "campaigner"} onChange={handleChange} />
                <label className="form-check-label" htmlFor="campaigner">Campaigner</label>
              </div>
            </div>
            <button type="submit" className="btn w-100 mb-3" style={{ backgroundColor: "#27ae60", borderColor: "#219a52", color: "white" }}>Sign Up</button>
          </form>
          <div className="text-center">
            <p className="mb-0">Already have an account? <a href="/login">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
