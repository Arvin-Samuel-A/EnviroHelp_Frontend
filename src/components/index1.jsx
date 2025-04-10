import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <style>{`
        /* Enhanced CSS */
        .navbar.bg-success {
          background: linear-gradient(45deg, #145f2a, #1e8f43) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          padding: 1.2rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-brand {
          font-weight: 800;
          font-size: 1.8rem;
          letter-spacing: 1.5px;
          color: #fff !important;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .navbar-brand:hover {
          color: #e6ffcc !important;
          transform: scale(1.05);
        }

        .nav-link {
          transition: all 0.3s ease;
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          color: #fff !important;
          position: relative;
        }

        .nav-link:hover {
          color: #e6ffcc !important;
          transform: translateY(-2px);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background: #e6ffcc;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 50%;
        }

        .hero-section {
          background: linear-gradient(rgba(0, 60, 0, 0.7), rgba(0, 60, 0, 0.7)), 
                     url('https://images.unsplash.com/photo-1501854140801-50d01698950b');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          padding: 150px 0;
          color: white;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
          min-height: 70vh;
          display: flex;
          align-items: center;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80px;
          background: linear-gradient(to top, #ffffff, transparent);
        }

        .eco-primary {
          background: linear-gradient(45deg, #2ca048, #34d058);
          border: none;
          border-radius: 30px;
          padding: 0.9rem 2.5rem;
          transition: all 0.4s ease;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .eco-primary:hover {
          background: linear-gradient(45deg, #247f3b, #2ca048);
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          color: #fff !important;
        }

        .feature-card {
          transition: all 0.4s ease;
          border: none;
          background: linear-gradient(135deg, #e8f5e9, #ffffff);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right, #34d058, #1a7f39);
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .card {
          transition: all 0.4s ease;
          border-radius: 20px;
          border: none;
          background: white;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .card-body {
          padding: 2.5rem;
          position: relative;
        }

        .card-title {
          position: relative;
          padding-bottom: 0.5rem;
        }

        .card-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 3px;
          background: #34d058;
          transition: width 0.3s ease;
        }

        .card:hover .card-title::after {
          width: 50px;
        }

        .bg-light {
          background: linear-gradient(to bottom, #f5f7f5, #ffffff) !important;
          position: relative;
        }

        .bg-light::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('https://www.transparenttextures.com/patterns/leaf.png');
          opacity: 0.05;
          pointer-events: none;
        }

        footer.bg-dark {
          background: linear-gradient(90deg, #1a2526, #2d3839) !important;
          padding: 3rem 0;
          position: relative;
          color: #e0e0e0;
        }

        footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(to right, #34d058, #1a7f39);
        }

        footer a {
          color: #e0e0e0;
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 0.3rem 0.7rem;
          position: relative;
        }

        footer a:hover {
          color: #34d058;
          transform: translateX(5px);
        }

        footer a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: 0;
          left: 0;
          background: #34d058;
          transition: width 0.3s ease;
        }

        footer a:hover::after {
          width: 100%;
        }

        h1, h2, h3, h5 {
          font-family: 'Arial', sans-serif;
          font-weight: 700;
          color: #1a3c1a;
          transition: color 0.3s ease;
        }

        h1:hover, h2:hover, h3:hover, h5:hover {
          color: #247f3b;
        }

        .display-4 {
          font-size: 4.5rem;
          line-height: 1.1;
          letter-spacing: -1.5px;
          animation: fadeIn 1s ease-in;
        }

        .lead {
          font-size: 1.6rem;
          font-weight: 300;
          color: #ffffff;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        section {
          scroll-margin-top: 80px;
        }

        p {
          color: #4a4a4a;
          line-height: 1.8;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 100px 0;
            background-attachment: scroll;
            min-height: 50vh;
          }
          
          .display-4 {
            font-size: 3rem;
          }
          
          .lead {
            font-size: 1.3rem;
          }
          
          .card-body {
            padding: 1.8rem;
          }
          
          .navbar-brand {
            font-size: 1.5rem;
          }
          
          .nav-link {
            padding: 0.5rem 1rem;
          }
          
          .eco-primary {
            padding: 0.7rem 2rem;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <a className="navbar-brand" href="#">EnviroHelp</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/campaigns">Campaigns</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-4 mb-4">Make a Difference in Your Community</h1>
          <p className="lead mb-4">Connect with environmental projects and volunteers in your area</p>
          <a href="#signup" className="btn btn-lg eco-primary text-white">Get Started</a>
        </div>
      </section>

      <section className="py-5" id="about">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            {["Create Campaigns", "Connect", "Make Impact"].map((title, index) => (
              <div className="col-md-4" key={index}>
                <div className="card feature-card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h5 mb-3">{title}</h3>
                    <p>{title === "Create Campaigns" ? "Post your initiative and describe the help you need" : title === "Connect" ? "Find volunteers and organizations willing to support your cause" : "Work together to create positive environmental change"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light py-5" id="projects">
        <div className="container">
          <h2 className="text-center mb-5">Featured Campaigns</h2>
          <div className="row g-4">
            {["River Cleanup Initiative", "Community Tree Planting", "Recycling Education"].map((title, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{title === "River Cleanup Initiative" ? "Join our monthly river cleanup project to protect local wildlife." : title === "Community Tree Planting" ? "Help us plant 1000 trees in urban areas this season." : "Educate communities about proper recycling practices."}</p>
                    <a href="#login" className="btn eco-primary text-white">Learn More</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>EnviroHelp</h5>
              <p>Connecting people for a greener future</p>
            </div>
            <div className="col-md-6 text-md-end">
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#" className="text-white">Privacy Policy</a></li>
                <li className="list-inline-item"><a href="#" className="text-white">Terms of Service</a></li>
                <li className="list-inline-item"><a href="#" className="text-white">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;