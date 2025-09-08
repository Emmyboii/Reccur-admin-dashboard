import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await fetch(
                    "https://reccur-141b5bf0e007.herokuapp.com/api/v1/dashboard/get_users",
                    {
                        headers: {
                            Authorization: token ? `Token ${token}` : "",
                        },
                    }
                );
                const data = await res.json()

                setUsers(data || []);
                console.log(data);

            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">👥 Users</h2>
            <p className="mt-2 text-gray-600">List of all users with their details.</p>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                            <th className="px-3 py-3">Full Name</th>
                            <th className="px-3 py-3">Email</th>
                            <th className="px-3 py-3">Date Joined</th>
                            <th className="px-3 py-3 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b hover:bg-gray-50 text-sm text-gray-800"
                                >
                                    <td className="px-3 py-3">{user.fullname}</td>
                                    <td className="px-3 py-3">{user.email}</td>
                                    <td className="px-3 py-3">
                                        {new Date(user.date_joined).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-3 py-3 text-end">
                                        <button
                                            onClick={() => navigate(`/users/${user.id}`)}
                                            className="px-3 py-1 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-3 py-3 text-center text-gray-600"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
