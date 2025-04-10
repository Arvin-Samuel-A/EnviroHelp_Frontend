import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import './VolunteerDashboard.css';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="col-md-3 col-lg-2 sidebar p-3 bg-success text-white min-vh-100">
      <h4 className="mb-4">Volunteer Portal</h4>
      <div className="nav flex-column">
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/")}>Home</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/login")}>Login</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/signup")}>Signup</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/volunteer")}>Volunteer</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/events")}>Events</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/resources")}>Resources</button>
        <button className="btn btn-danger text-white text-start nav-link mt-auto" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

const StatsCards = ({ stats }) => (
  <div className="row mb-4">
    {[
      { title: "Active Projects", value: stats?.activeCount || 0, bg: "success" },
      { title: "Campaigns Completed", value: stats?.campaigns_completed || 0, bg: "info" },
      { title: "Flagged Status", value: stats?.is_flagged ? "Yes" : "No", bg: "warning" }
    ].map((stat, index) => (
      <div className="col-md-4" key={index}>
        <div className={`card bg-${stat.bg} text-white`}>
          <div className="card-body">
            <h5 className="card-title">{stat.title}</h5>
            <h2>{stat.value}</h2>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ProjectCard = ({ project }) => {
  const handleProgressUpdate = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    const newProgress = prompt("Enter new completion %", project.completion_percent);
    
    if (newProgress && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
      try {
        await axios.patch(
          `https://envirohelp-910201264545.asia-south1.run.app/volunteer/campaign/view/${project.id}`,
          { completion_percent: Number(newProgress) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            
          }
        );
        alert("Progress updated successfully");
        window.location.reload();
      } catch (err) {
        alert(err.response?.data?.error || "Error updating progress");
      }
    } else {
      alert("Please enter a valid number between 0 and 100");
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{project.name}</h5>
          <p className="card-text">Progress: {project.completion_percent}%</p>
          <p className="card-text">{project.is_flagged ? "🚩 Flagged" : ""}</p>
          <div className="progress mb-3">
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${project.completion_percent}%` }}
            >
              {project.completion_percent}% Complete
            </div>
          </div>
          <button className="btn btn-success" onClick={handleProgressUpdate}>
            Update Progress
          </button>
        </div>
      </div>
    </div>
  );
};

const RequestCard = ({ request }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    alert("No authentication token found. Please log in.");
    return null;
  }

  const handleAccept = async () => {
    try {
      await axios.patch(
        `https://envirohelp-910201264545.asia-south1.run.app/volunteer/request/view/${request.id}`, // Changed to campaign_id
        { 
          assigned: "true",
          requirements: request.requirements || "" // Added requirements to satisfy backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          
        }
      );
      alert("Request accepted!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Error accepting request");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://envirohelp-910201264545.asia-south1.run.app/volunteer/request/view/${request.id}`, // Changed to campaign_id
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          
        }
      );
      alert("Request deleted.");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting request");
    }
  };

  return (
    <div className="col-md-6">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{request.name}</h5>
          <p className="card-text">
            Campaigner Updated: {request.campaigner_updated ? "Yes" : "No"}
          </p>
          <p className="card-text">
            Requirements: {request.requirements}
          </p>
          <button className="btn btn-primary me-2" onClick={handleAccept}>
            Accept
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [volunteer, setVolunteer] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found. Redirecting to login...");
          navigate("/login");
          return;
        }

        const res = await axios.get("https://envirohelp-910201264545.asia-south1.run.app/volunteer/home", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const volunteerData = {
          name: res.data.name || "Volunteer",
          profile_pic: res.data.profile_pic || "",
          campaigns_completed: res.data.campaigns_completed || 0,
          is_flagged: res.data.is_flagged || false,
          activeCount: res.data.active_campaigns?.length || 0,
          newRequests: res.data.new_requests || []
        };

        setCampaigns(res.data.active_campaigns || []);
        setRequests(res.data.new_requests || []);
        setVolunteer(volunteerData);
      } catch (err) {
        console.error("Error fetching volunteer data:", err);
        alert(err.response?.data?.error || "Error loading dashboard");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const filteredProjects = campaigns.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-9 col-lg-10 p-4">
          <h2 className="mb-4">Welcome, {volunteer.name}!</h2>
          <StatsCards stats={volunteer} />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Your Active Projects</h4>
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="row g-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <p>No active projects found.</p>
            )}
          </div>

          <h4 className="mt-5 mb-3">New Requests ({requests.length})</h4>
          <div className="row g-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <p>No new requests found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;