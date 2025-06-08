import React from "react";
import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;
