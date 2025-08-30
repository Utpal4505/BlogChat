import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Your routed pages */}
      <Outlet />
    </>
  );
}

export default App;
