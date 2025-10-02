import React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

function MinimalLayout() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Outlet />
    </>
  );
}

export default MinimalLayout;
