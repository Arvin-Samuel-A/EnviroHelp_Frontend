import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.session_id); // ✅ Rename for consistency
        localStorage.setItem("role", data.role);

        if (data.role === "volunteer") {
          navigate("/volunteer");
        } else if (data.role === "campaigner") {
          navigate("/campaigner");
        } else {
          alert("Unknown role, redirecting to home.");
          navigate("/");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 login-background">
      <div className="col-md-6 col-lg-4">
        <div className="card login-card p-4">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success w-100">Login</button>
          </form>
          <div className="text-center mt-3">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx="true">{`
        .login-background {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
        }

        .login-card {
          background-color: #ffffff;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }

        .login-card:hover {
          transform: scale(1.02);
        }

        .form-control {
          border-radius: 10px;
        }

        .btn-success {
          border-radius: 10px;
          font-weight: bold;
          background-color: #28a745;
          border: none;
        }

        .btn-success:hover {
          background-color: #218838;
        }

        a {
          color: #2ecc71;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;


