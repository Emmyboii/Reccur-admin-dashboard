import Dashboard from "./Pages/Dashboard";
import { Route, Routes } from 'react-router-dom';
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import { useEffect } from "react";
import ProtectedRoute from "./Components/ProtectedRoutes";
function App() {

  useEffect(() => {
    const timestamp = localStorage.getItem('tokenTimestamp');
    const now = Date.now();
    const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
    if (timestamp && now - Number(timestamp) > TWO_DAYS) {
      localStorage.clear();
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;
