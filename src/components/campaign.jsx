import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./campaign.css";
import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
  return createPortal(children, document.body);
};

const Sidebar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  return (
    <div className="col-md-3 col-lg-2 sidebar p-3 bg-success text-white min-vh-100 d-flex flex-column">
      <h4 className="mb-4">Campaigner Portal</h4>
      <div className="nav flex-column">
        <button className={`btn btn-dark text-white text-start nav-link mb-2 ${activeSection === "home" ? "active" : ""}`} onClick={() => setActiveSection("home")}>
          New Requests
        </button>
        <button className={`btn btn-dark text-white text-start nav-link mb-2 ${activeSection === "active" ? "active" : ""}`} onClick={() => setActiveSection("active")}>
          Active Campaigns
        </button>
        <button className={`btn btn-dark text-white text-start nav-link mb-2 ${activeSection === "unassigned" ? "active" : ""}`} onClick={() => setActiveSection("unassigned")}>
          Unassigned Campaigns
        </button>
        <hr className="border-light" />
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/")}>Home</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/login")}>Login</button>
        <button className="btn btn-dark text-white text-start nav-link" onClick={() => navigate("/signup")}>Signup</button>
        <button className="btn btn-danger text-white text-start nav-link mt-auto" onClick={() => navigate("/")}>Logout</button>
      </div>
    </div>
  );
};

const ModifyCampaign = ({ campaign, onDelete }) => {
  const [formData, setFormData] = useState({
    name: campaign.name || "",
    description: campaign.description || "",
    start_date: campaign.start_date || "",
    end_date: campaign.end_date || "",
    goal: campaign.goal || "",
    contact: campaign.contact || ""
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `https://envirohelp-910201264545.asia-south1.run.app/campaigner/campaign/view/${campaign.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      alert("Campaign updated successfully!");
      setShowForm(false);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating campaign");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      await onDelete(campaign.id);
      setShowForm(false);
    }
  };

  return (
    <>
      <button className="btn btn-warning btn-md" onClick={() => setShowForm(true)}>
        Modify
      </button>

      {showForm && (
        <ModalPortal>
          {/* Backdrop */}
          <div className="modal-backdrop show"></div>
          {/* Modal */}
          <div className="modal show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Modify Campaign</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    {["name", "description", "start_date", "end_date", "goal", "contact"].map((key) => (
                      <div className="mb-3" key={key}>
                        <label className="form-label">{key.replace("_", " ").toUpperCase()}</label>
                        <input
                          type={key.includes("date") ? "date" : "text"}
                          className="form-control"
                          name={key}
                          value={formData[key]}
                          onChange={handleChange}
                        />
                      </div>
                    ))}
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-success">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                        disabled={campaign.assigned_to}
                      >
                        Delete
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

// CampaignCard Component (Standardized Button Sizes and Styling)
const CampaignCard = ({ campaign, onView, onDelete, onRequest }) => {
  const [showModal, setShowModal] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [requirements, setRequirements] = useState("");

  const handleViewDetails = async () => {
    const details = await onView(campaign.id);
    setCampaignDetails(details);
    setShowModal(true);
  };

  const handleSearchVolunteers = async () => {
    const token = localStorage.getItem("token");
    if (!token || !searchTerm) return;
    try {
      const res = await axios.get(`https://envirohelp-910201264545.asia-south1.run.app/campaigner/volunteer/${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolunteers(res.data.volunteers || []);
    } catch (err) {
      console.error("Error searching volunteers:", err);
    }
  };

  const handleRequestVolunteer = async (volunteerId) => {
    await onRequest(campaign.id, volunteerId, requirements);
    setShowRequestModal(false);
    setSearchTerm("");
    setVolunteers([]);
    setRequirements("");
  };

  return (
    <>
      <div className="col-md-6 col-lg-5 mb-4">
        <div className="card h-100 shadow">
          <div className="card-body">
            <h5 className="card-title">{campaign.name}</h5>
            <p className="card-text">Progress: {campaign.completion_percent}%</p>
            <div className="d-flex justify-content-between align-items-center mt-3 gap-2">
              <button onClick={handleViewDetails} className="btn btn-primary btn-md flex-grow-1">Details</button>
              <ModifyCampaign campaign={{ ...campaign, id: campaign.id }} onDelete={onDelete} />
              <button 
                className="btn btn-info btn-md flex-grow-1" 
                onClick={() => setShowRequestModal(true)} 
                disabled={campaign.assigned_to}
              >
                Request 
              </button>
              <button 
                className="btn btn-danger btn-md flex-grow-1" 
                onClick={() => onDelete(campaign.id)} 
                disabled={campaign.assigned_to}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && campaignDetails && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{campaignDetails.name}</h5>
                <button className="close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <p><strong>Description:</strong> {campaignDetails.description || "No description provided"}</p>
                <p><strong>Start Date:</strong> {campaignDetails.start_date || "N/A"}</p>
                <p><strong>End Date:</strong> {campaignDetails.end_date || "N/A"}</p>
                <p><strong>Goal:</strong> {campaignDetails.goal || "Not specified"}</p>
                <p><strong>Assigned To:</strong> {campaignDetails.assigned_to || "Unassigned"}</p>
                <p><strong>Contact:</strong> {campaignDetails.contact || "No contact info"}</p>
                <p><strong>Created Date:</strong> {campaignDetails.created_date || "Unknown"}</p>
                {campaignDetails.is_flagged && <p className="text-danger"><strong>⚠ This campaign has been flagged!</strong></p>}
                <p><strong>Progress:</strong> {campaignDetails.completion_percent || 0}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Volunteer for {campaign.name}</h5>
                <button type="button" className="close" onClick={() => setShowRequestModal(false)}>
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Search Volunteer</label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter volunteer name"
                    />
                    <button className="btn btn-primary ms-2" onClick={handleSearchVolunteers}>Search</button>
                  </div>
                </div>
                {volunteers.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Select Volunteer</label>
                    <ul className="list-group">
                      {volunteers.map((volunteer) => (
                        <li key={volunteer.id} className="list-group-item d-flex justify-content-between align-items-center">
                          {volunteer.name}
                          <button className="btn btn-sm btn-success" onClick={() => handleRequestVolunteer(volunteer.id)}>Request</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Requirements</label>
                  <textarea
                    className="form-control"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Enter requirements for the volunteer"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// CampaignerDashboard Component (Unchanged except for integration)
const CampaignerDashboard = () => {
  const [assignedCampaigns, setAssignedCampaigns] = useState([]);
  const [unassignedCampaigns, setUnassignedCampaigns] = useState([]);
  const [campaignerInfo, setCampaignerInfo] = useState({ name: "", profile_pic: "", is_flagged: false, new_requests: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goal, setGoal] = useState("");
  const [contact, setContact] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerDetails, setVolunteerDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
    // fetchAssignedUnassignedCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get("https://envirohelp-910201264545.asia-south1.run.app/campaigner/home", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAssignedCampaigns(res.data.active_campaigns);
      setUnassignedCampaigns(res.data.unassigned_campaigns);
      setCampaignerInfo({
        name: res.data.name || "Campaigner",
        profile_pic: res.data.profile_pic || "",
        is_flagged: res.data.is_flagged || false,
        new_requests: res.data.new_requests || [],
      });
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  // const fetchAssignedUnassignedCampaigns = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }
  //   try {
  //     const res = await axios.get("https://envirohelp-910201264545.asia-south1.run.app/campaigner/campaign", { headers: { Authorization: `Bearer ${token}` } });
  //     setAssignedCampaigns(res.data.assigned_campaigns || []);
  //     setUnassignedCampaigns(res.data.unassigned_campaigns || []);
  //   } catch (err) {
  //     console.error("Error fetching assigned/unassigned campaigns:", err);
  //   }
  // };

  const fetchVolunteers = async (search) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(`https://envirohelp-910201264545.asia-south1.run.app/campaigner/volunteer/${search}`, { headers: { Authorization: `Bearer ${token}` } });
      setVolunteers(res.data.volunteers || []);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
    }
  };

  const fetchVolunteerDetails = async (volunteerId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(`https://envirohelp-910201264545.asia-south1.run.app/campaigner/volunteer/view/${volunteerId}`, { headers: { Authorization: `Bearer ${token}` } });
      setVolunteerDetails(res.data);
    } catch (err) {
      console.error("Error fetching volunteer details:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post("https://envirohelp-910201264545.asia-south1.run.app/campaigner/campaign/view", { name: name, description: description, start_date: (new Date(startDate)).toISOString(), end_date: (new Date(endDate)).toISOString(), goal, contact }, { headers: { Authorization: `Bearer ${token}` } });
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setGoal("");
      setContact("");
      setShowModal(false);
      fetchCampaigns();
    } catch (err) {
      console.error("Error creating campaign:", err.response?.data?.error);
      alert(err.response?.data?.error || "Error creating campaign");
    }
  };

  const handleViewDetails = async (campaignId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    try {
      const res = await axios.get(`https://envirohelp-910201264545.asia-south1.run.app/campaigner/campaign/view/${campaignId}`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    } catch (err) {
      console.error("Error fetching campaign details:", err);
      return null;
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`https://envirohelp-910201264545.asia-south1.run.app/campaigner/campaign/view/${campaignId}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("Campaign deleted successfully!");
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting campaign");
    }
  };

  const handleRequestVolunteer = async (campaignId, volunteerId, requirements) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `https://envirohelp-910201264545.asia-south1.run.app/campaigner/request/view/${campaignId}/${volunteerId}`,
        { requirements },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Volunteer request sent successfully!");
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.error || "Error sending volunteer request");
    }
  };

  const handleRequestAction = async (campaignId, volunteerId, action, requirements = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (action === "approve") {
        await axios.patch(`https://envirohelp-910201264545.asia-south1.run.app/campaigner/request/view/${campaignId}/${volunteerId}`, { requirements, assigned: "true" }, { headers: { Authorization: `Bearer ${token}` } });
        alert("Request approved!");
      } else if (action === "delete") {
        await axios.delete(`https://envirohelp-910201264545.asia-south1.run.app/campaigner/request/view/${campaignId}/${volunteerId}`, { headers: { Authorization: `Bearer ${token}` } });
        alert("Request deleted!");
      } else if (action === "update") {
        await axios.patch(`https://envirohelp-910201264545.asia-south1.run.app/campaigner/request/view/${campaignId}/${volunteerId}`, { requirements }, { headers: { Authorization: `Bearer ${token}` } });
        alert("Request updated!");
      }
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.error || "Error handling request");
    }
  };

  const handleSearch = () => {
    if (searchTerm) fetchVolunteers(searchTerm);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="col-md-9 col-lg-10 p-4 d-flex flex-column min-vh-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Welcome, {campaignerInfo.name}</h2>
              {campaignerInfo.is_flagged && <p className="text-danger mt-2">You have been flagged!</p>}
            </div>
            {campaignerInfo.profile_pic && <img src={campaignerInfo.profile_pic} alt="Profile" className="rounded-circle ms-3" style={{ width: 80, height: 80, objectFit: "cover" }} />}
          </div>

          <div className="mb-3">
            <button className="btn btn-success" onClick={() => setShowModal(true)}>+ New Campaign</button>
          </div>

          <hr />

          {activeSection === "home" && (
            <>
              <h4>New Requests</h4>
              {campaignerInfo.new_requests.length > 0 ? (
                <ul className="list-group">
                  {campaignerInfo.new_requests.map((req, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{req.name} - {req.id}</span>
                      <div>
                        <button className="btn btn-primary mx-2" onClick={() => handleRequestAction(req.id, req.volunteer_id, "approve", req.requirements)}>Approve</button>
                        <button className="btn btn-warning mx-2" onClick={() => handleRequestAction(req.id, req.volunteer_id, "update", prompt("Enter new requirements:"))}>Update</button>
                        <button className="btn btn-danger" onClick={() => handleRequestAction(req.id, req.volunteer_id, "delete")}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No new requests</p>
              )}
            </>
          )}

          {activeSection === "active" && (
            <>
              <h4>Active Campaigns</h4>
              <div className="row">
                {assignedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} onView={handleViewDetails} onDelete={handleDeleteCampaign} onRequest={handleRequestVolunteer} />
                ))}
              </div>
            </>
          )}

          {activeSection === "unassigned" && (
            <>
              <h4>Unassigned Campaigns</h4>
              <div className="row">
                {unassignedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} onView={handleViewDetails} onDelete={handleDeleteCampaign} onRequest={handleRequestVolunteer} />
                ))}
              </div>
              <div className="mt-4 mb-3 d-flex">
                <input type="text" placeholder="Search Volunteers" className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button className="btn btn-primary ms-2" onClick={handleSearch}>Search</button>
              </div>
            </>
          )}

          {volunteers.length > 0 && (
            <div className="mt-3">
              <h4>Volunteers</h4>
              <ul className="list-group">
                {volunteers.map((volunteer) => (
                  <li key={volunteer.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {volunteer.name}
                    <button className="btn btn-info" onClick={() => fetchVolunteerDetails(volunteer.id)}>View Details</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {volunteerDetails && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{volunteerDetails.name}</h5>
                    <button className="close" onClick={() => setVolunteerDetails(null)}>×</button>
                  </div>
                  <div className="modal-body">
                    <p><strong>Campaigns Completed:</strong> {volunteerDetails.campaigns_completed}</p>
                    <p><strong>Contact:</strong> {volunteerDetails.contact}</p>
                    {volunteerDetails.profile_pic && <img src={volunteerDetails.profile_pic} alt="Profile" style={{ width: 100, height: 100, objectFit: "cover" }} />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create New Campaign</h5>
                    <button className="close" onClick={() => setShowModal(false)}>×</button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Goal</label>
                        <input type="text" className="form-control" value={goal} onChange={(e) => setGoal(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Contact</label>
                        <input type="text" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} required />
                      </div>
                      <button type="submit" className="btn btn-success mt-3">Submit</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignerDashboard;