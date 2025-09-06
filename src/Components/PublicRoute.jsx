import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {

    const token = localStorage.getItem('reccurAdminToken')
    const isAuthenticated = token && token !== 'undefined' && token !== 'null';

    if (isAuthenticated) {
        return <Navigate to='/' />
    }

    return children
}

export default PublicRoute