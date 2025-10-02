import React from "react";
import Navbar from "../../components/Navbar";
import NavigationSidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function MainLayout() {
  return (
    <>
          <Toaster position="top-center" reverseOrder={false} />

      <Navbar />
      <NavigationSidebar />
      {/* Your routed pages */}
      <Outlet />
    </>
  );
}

export default MainLayout;
