import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [users] = useState([
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            accounts: 2,
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            accounts: 1,
        },
        {
            id: 3,
            firstName: "Michael",
            lastName: "Brown",
            email: "michael.brown@example.com",
            accounts: 3,
        },
        {
            id: 4,
            firstName: "Emily",
            lastName: "Davis",
            email: "emily.davis@example.com",
            accounts: 2,
        },
    ]);

    const navigate = useNavigate();

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
                            <th className="px-3 py-3">Accounts</th>
                            <th className="px-3 py-3 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b hover:bg-gray-50 text-sm text-gray-800"
                            >
                                <td className="px-3 py-3">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="px-3 py-3">{user.email}</td>
                                <td className="px-3 py-3">{user.accounts}</td>
                                <td className="px-3 py-3 text-end">
                                    <button
                                        onClick={() => navigate(`/users/${user.id}`)}
                                        className="px-3 py-1 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
