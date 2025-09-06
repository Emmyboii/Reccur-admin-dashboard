import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {

    const token = localStorage.getItem('reccurAdminToken')
    const isAuthenticated = token && token !== 'undefined' && token !== 'null';

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to='/login' />
    )
}

export default ProtectedRoute