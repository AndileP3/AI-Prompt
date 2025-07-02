import React from "react";
import "./../index.css"; // if needed to ensure styles are available
import logo from "../assets/main-logo.png";


export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <img src={logo} alt="Loading..." className="loading-logo" />
      <div className="loading-spinner"></div>
    </div>
  );
}
