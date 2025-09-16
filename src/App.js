import Dashboard from "./Pages/Dashboard";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import { useEffect, useState } from "react";
import ProtectedRoute from "./Components/ProtectedRoutes";
import PublicRoute from "./Components/PublicRoute";
import Sidebar from "./Components/Sidebar";
import Users from "./Pages/Users";
import { FiMenu } from "react-icons/fi";
import UserDetails from "./Pages/UserDetails";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation()

  useEffect(() => {
    const timestamp = localStorage.getItem("tokenTimestamp");
    const now = Date.now();
    const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
    if (timestamp && now - Number(timestamp) > TWO_DAYS) {
      localStorage.clear();
    }
  }, []);

  const hide = location.pathname.includes('/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      {!hide && (
        <div className="hidden mp:block w-64 bg-white shadow-lg">
          <Sidebar />
        </div>
      )}

      {/* Mobile sidebar (drawer) */}
      {!hide && (
        <>
          {sidebarOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-30 z-30"
                onClick={() => setSidebarOpen(false)}
              />

              {/* Sidebar */}
              <div
                className={`fixed inset-y-0 left-0 w-64 bg-white h-full shadow-lg z-40 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
              >
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
              </div>
            </>
          )}
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar with menu button for mobile */}
        {!hide && (
          <div className="mp:hidden flex items-center justify-between bg-white p-4 shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 text-2xl"
            >
              <FiMenu />
            </button>
            <h1 className="text-xl font-bold">Reccur Admin</h1>
          </div>
        )}

        <div className="p-4 flex-1 min-w-0">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
