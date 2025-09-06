import { useState } from "react";

const Users = () => {
    const [users] = useState([
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            balance: 2500,
            sent: 1200,
            kyc: true,
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            balance: 4300,
            sent: 2300,
            kyc: false,
        },
        {
            id: 3,
            firstName: "Michael",
            lastName: "Brown",
            email: "michael.brown@example.com",
            balance: 1800,
            sent: 800,
            kyc: true,
        },
        {
            id: 4,
            firstName: "Emily",
            lastName: "Davis",
            email: "emily.davis@example.com",
            balance: 5200,
            sent: 3000,
            kyc: false,
        },
    ]);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">👥 Users</h2>
            <p className="mt-2 text-gray-600">List of all users with their details.</p>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse hidden mp:table">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                            <th className="px-2 py-5">First Name</th>
                            <th className="px-2 py-5">Last Name</th>
                            <th className="px-2 py-5">Email</th>
                            <th className="px-2 py-5">Account Balance</th>
                            <th className="px-2 py-5">Money Sent</th>
                            <th className="px-2 py-5">KYC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b hover:bg-gray-50 text-sm text-gray-800"
                            >
                                <td className="px-2 py-5">{user.firstName}</td>
                                <td className="px-2 py-5">{user.lastName}</td>
                                <td className="px-2 py-5">{user.email}</td>
                                <td className="px-2 py-5">${user.balance.toLocaleString()}</td>
                                <td className="px-2 py-5">${user.sent.toLocaleString()}</td>
                                <td className="px-2 py-5">
                                    {user.kyc ? (
                                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                            ✅ Completed
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                                            ❌ Pending
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile View (Cards) */}
                <div className="grid gap-4 mp:hidden mt-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="border rounded-xl p-4 shadow-sm bg-gray-50"
                        >
                            <p className="font-bold text-gray-800">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="mt-2 text-sm text-gray-700 space-y-1">
                                <p>
                                    <span className="font-semibold">Balance:</span> $
                                    {user.balance.toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-semibold">Sent:</span> $
                                    {user.sent.toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-semibold">KYC:</span>{" "}
                                    {user.kyc ? (
                                        <span className="text-green-600 font-semibold">
                                            ✅ Completed
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">
                                            ❌ Pending
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Users;
