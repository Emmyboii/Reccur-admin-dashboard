import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("reccurAdminToken");

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/login" replace />;
    }

    return children; // ✅ If logged in, show Dashboard
};

export default ProtectedRoute;
