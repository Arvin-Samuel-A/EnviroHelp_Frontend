import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div  id ="ak" className="col-md-3 col-lg-2 sidebar p-3 bg-success text-white min-vh-100">
      <h4 className="mb-4">Admmin Portal</h4>
      <div className="nav flex-column">
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/")}>Home</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/admin")}>Dashboard</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/campaign")}>Campaign Review</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/login")}>Login</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/signup")}>Signup</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/volunteer")}>Volunteer</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/events")}>Events</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/resources")}>Resources</button>
        <button className="btn btn-danger text-white text-start nav-link mt-auto" onClick={() => navigate("/")}>Logout</button>
      </div>
    </div>
  );
};

const StatusCard = ({ title, value, info, bgColor }) => {
  return (
    <div className="col-md-3 mb-3">
      <div className="p-3 text-white text-center rounded" style={{ backgroundColor: bgColor }}>
        <h5>{title}</h5>
        <h2>{value}</h2>
        <small>{info}</small>
      </div>
    </div>
  );
};

const UserTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const users = [
    { name: "Arvin Samuel A", role: "Volunteer", joined: "Jan 15, 2025" },
    { name: "Guardians of Mother Nature", role: "Campaigner", joined: "Jan 12, 2025" },
  ];

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">User Management</h5>
        <input type="search" className="form-control form-control-sm w-25" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <div className="card-body">
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.joined}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2">View</button>
                    <button className="btn btn-danger btn-sm">Flag</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-9 col-lg-10 p-4">
          <h2>Admin Dashboard</h2>
          <div className="row mb-4">
            <StatusCard title="Total Users" value="1,234" info="↑ 12% this month" bgColor="#007bff" />
            <StatusCard title="Active Campaigns" value="45" info="↑ 8% this month" bgColor="#28a745" />
            <StatusCard title="Pending Reviews" value="23" info="5 urgent" bgColor="#ffc107" />
            <StatusCard title="System Health" value="98%" info="All systems operational" bgColor="#17a2b8" />
          </div>
          <UserTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;