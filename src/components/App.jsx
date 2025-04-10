import React from "react";
import { Routes, Route, Link } from "react-router-dom"; // ❌ Removed BrowserRouter
import Admin from "./admin";
import CampaignReview from "./campaign";
import Index from "./index1";
import Login from "./login";
import Signup from "./signup";
import Volunteer from "./volunteer";

export default function App() {
  return (
    <div>
      {/* Navigation Bar */}
   

      {/* Define all your routes here */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/campaigner" element={<CampaignReview />} />
        <Route path="/volunteer" element={<Volunteer />} />
      </Routes>
    </div>
  );
}
