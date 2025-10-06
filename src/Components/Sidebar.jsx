import { NavLink } from "react-router-dom";
import { FiHome, FiUsers } from "react-icons/fi";
import Logo from "../Images/Logo base2.svg";
import { IoLogOutOutline } from "react-icons/io5";

const Sidebar = ({ closeSidebar }) => {

  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="h-screen w-64 bg-white border-r fixed border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="h-16 flex items-center px-3 border-b border-gray-200">
        <a href="/" onClick={closeSidebar}>
          <div className="flex gap-2 items-center">
            <img className="3xl:size-10" src={Logo} alt="" />
            <h1 className="text-xl font-bold">Reccur Admin</h1>
          </div>
        </a>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col mt-6 space-y-2 px-3">
        <NavLink
          to="/"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium 
            ${isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`
          }
        >
          <FiHome size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/users"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium 
            ${isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`
          }
        >
          <FiUsers size={18} />
          Users
        </NavLink>
      </nav>

      <div
        to="/users"
        onClick={() => logout()}
        className={`flex items-center gap-3 cursor-pointer text-red-500 px-6 absolute bottom-5 py-2 rounded-lg text-base font-medium`}
      >
        <IoLogOutOutline size={18} />
        Log Out
      </div>
    </div>
  );
};

export default Sidebar;
