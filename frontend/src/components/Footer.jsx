// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="px-4 pb-4 mt-auto">
      <div className="neo-card rounded-[24px] max-w-6xl mx-auto text-center py-4 text-green-800">
        <p className="text-sm font-semibold">
          © {new Date().getFullYear()} EcoLearn — Building a Greener Future Together 🌎
        </p>
        <div className="flex justify-center gap-6 mt-2 text-sm font-semibold">
          <a href="/about" className="text-green-700 hover:underline">
            About
          </a>
          <a href="/contact" className="text-green-700 hover:underline">
            Contact
          </a>
          <a href="/privacy" className="text-green-700 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;