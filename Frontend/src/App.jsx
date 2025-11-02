import "./App.css";
import { Toaster } from "react-hot-toast";
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
