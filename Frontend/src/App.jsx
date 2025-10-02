import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MainLayout from "./layouts/MainLayout";


function App() {
  return (
    <>
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />
      <MainLayout />
    </>
  );
}

export default App;
