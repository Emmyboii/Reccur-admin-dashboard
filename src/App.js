import Dashboard from "./Pages/Dashboard";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import { useEffect, useState } from "react";
import ProtectedRoute from "./Components/ProtectedRoutes";
import PublicRoute from "./Components/PublicRoute";
import Users from "./Pages/Users";
import UserDetails from "./Pages/UserDetails";
import Logo from './Images/Logo_base2.svg';
import { LuLayoutDashboard } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";

function App() {
  const [dashboardView, setDashboardView] = useState(() => {
    const view = localStorage.getItem('dashboardView') || 'dashboard'

    return view
  });
  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    const timestamp = localStorage.getItem("tokenTimestamp");
    const now = Date.now();
    const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
    if (timestamp && now - Number(timestamp) > TWO_DAYS) {
      localStorage.clear();
    }
  }, []);

  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  const hide = location.pathname.includes('/login')

  return (
    <div className="min-h-screen bg-[#f8f7fa]">

      {!hide && (
        <div className="py-4 sm:px-10 px-5 bg-white border-[1.5px] border-purple-200 flex sp:flex-row flex-col sp:items-center items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={Logo} className="size-[30px]" alt="" />
            <div className="space-y-1">
              <p className="text-base font-semibold">Reccur Dashboard</p>
              <p className="font-medium text-black/60 text-sm">Global Payment Platform</p>
            </div>
          </div>

          <p className="rounded-full bg-purple-100 text-sm text-purple-500 p-3 sp:block hidden">USD/EUR Accounts</p>
        </div>
      )}

      {!hide && (
        <div className="flex sp:flex-row flex-col sp:items-center items-start justify-between gap-4 sm:p-10 p-5">

          <div className="p-2 w-[270px] border-[1.5px] border-purple-200 flex items-center justify-between mx-auto sm:mx-10 gap-2 rounded-xl bg-white">
            <div onClick={() => {
              navigate('/')
              setDashboardView('dashboard')
              localStorage.setItem('dashboardView', 'dashboard')
            }} className={`flex items-center ${dashboardView === 'dashboard' && 'rounded-full bg-purple-500 text-white'} p-2 py-1 cursor-pointer gap-2`}>
              <LuLayoutDashboard className="text-lg" />
              <p className="font-semibold text-lg">Dashboard</p>
            </div>

            <div onClick={() => {
              navigate('/')
              setDashboardView('users')
              localStorage.setItem('dashboardView', 'users')
            }} className={`flex items-center ${dashboardView === 'users' && 'rounded-full bg-purple-500 text-white'} p-2 py-1 cursor-pointer gap-2`}>
              <GoPeople className="text-lg" />
              <p className="font-semibold text-lg">Users</p>
            </div>
          </div>

          <div
            onClick={() => logout()}
            className={`flex items-center text-left gap-3 cursor-pointer text-red-500 py-2 rounded-lg text-base font-medium`}
          >
            <IoLogOutOutline size={18} />
            Log Out
          </div>
        </div>
      )}

      {/* Main content */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {dashboardView === 'dashboard' ? (
                <Dashboard />
              ) : (
                <Users />
              )}
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
  );
}

export default App;
