import React from "react";
import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "./assets/logo/company-logo.svg"; // Adjust the path if needed

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center p-4 bg-white shadow">
        <img src={logo} alt="Company Logo" className="h-8 w-auto" />
        <h1 className="ml-4 text-xl font-bold">DevOps Dashboard</h1>
      </header>

      <Dashboard />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;
