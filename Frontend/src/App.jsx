import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


function App() {
  return (
    <>
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Sidebar />
      {/* Your routed pages */}
      <Outlet />
    </>
  );
}

export default App;
