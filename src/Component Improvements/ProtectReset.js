import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectReset = () => {
  const resetEmail = localStorage.getItem("reset_email");

  return resetEmail ? <Outlet /> : <Navigate to="/forget-password" />;
};

export default ProtectReset;
