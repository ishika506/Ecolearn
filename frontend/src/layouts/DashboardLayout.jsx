// src/components/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-green-400">
      <Navbar />

      <main className="flex-1 px-4 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;