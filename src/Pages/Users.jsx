import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [kyc, setKyc] = useState([]);

    useEffect(() => {
        const fetchUsersAndData = async () => {
            try {
                const token = localStorage.getItem("reccurAdminToken");

                const res = await fetch(
                    "https://reccur-141b5bf0e007.herokuapp.com/api/v1/dashboard/get_users",
                    {
                        headers: {
                            Authorization: token ? `Token ${token}` : "",
                        },
                    }
                );
                const usersData = await res.json();
                setUsers(usersData || []);

                const transactionsData = await Promise.all(
                    (usersData || []).map(async (user) => {
                        try {
                            const res3 = await fetch(
                                `https://reccur-141b5bf0e007.herokuapp.com/api/v1/transactions?user_id=${user.id}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: token ? `Token ${token}` : "",
                                    },
                                }
                            );
                            const data3 = await res3.json();
                            return { userId: user.id, transactions: data3 };
                        } catch (err) {
                            console.error(`Error fetching transactions for ${user.id}:`, err);
                            return { userId: user.id, transactions: [] };
                        }
                    })
                );
                setTransactions(transactionsData);

                const accountsData = await Promise.all(
                    (usersData || []).map(async (user) => {
                        try {
                            const res4 = await fetch(
                                `https://reccur-141b5bf0e007.herokuapp.com/api/v1/account?user_id=${user.id}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: token ? `Token ${token}` : "",
                                    },
                                }
                            );
                            const data4 = await res4.json();
                            return { userId: user.id, accounts: data4 };
                        } catch (err) {
                            console.error(`Error fetching accounts for ${user.id}:`, err);
                            return { userId: user.id, accounts: [] };
                        }
                    })
                );
                setAccounts(accountsData);

                const kycData = await Promise.all(
                    (usersData || []).map(async (user) => {
                        try {
                            const res5 = await fetch(
                                `https://reccur-141b5bf0e007.herokuapp.com/api/v1/kyc?user_id=${user.id}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: token ? `Token ${token}` : "",
                                    },
                                }
                            );
                            const data5 = await res5.json();
                            return { userId: user.id, kyc: data5 };
                        } catch (err) {
                            console.error(`Error fetching kyc for ${user.id}:`, err);
                            return { userId: user.id, kyc: [] };
                        }
                    })
                );
                setKyc(kycData);

            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndData();
    }, []);

    function formatPhoneNumber(number) {
        if (!number) return '';

        // Remove spaces and special characters just in case
        number = number.replace(/[\s-]/g, '');

        // Remove +243 country code if present
        if (number.startsWith('+234')) {
            number = number.replace('+234', '');
        }

        // If it starts with 243 without +, remove it too
        if (number.startsWith('234')) {
            number = number.replace('234', '');
        }

        // If it doesn't start with 0, add it
        if (!number.startsWith('0')) {
            number = '0' + number;
        }

        // Make sure it's only 10 or 11 digits max (clean up)
        number = number.replace(/[^\d]/g, '').slice(0, 11);

        return number;
    }

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
        <div className="p-6 bg-white rounded-2xl shadow-sm overflow-x-">
            <div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">👥 Users</h2>
                    <p className="mt-2 text-gray-600">List of all users with their details.</p>
                </div>
                <p className="mt-2 text-gray-600">Total: {users.length}</p>
            </div>
            <div className="mt-6 overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                <table className="w-full min-w-[900px] text-nowrap border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                            <th className="px-3 py-3">Full Name</th>
                            <th className="px-3 py-3">Email</th>
                            <th className="px-3 py-3">Phone number</th>
                            <th className="px-3 py-3">KYC</th>
                            <th className="px-3 py-3 text-center">Accounts</th>
                            <th className="px-3 py-3 text-center">Transactions Made</th>
                            <th className="px-3 py-3">Date Joined</th>
                            <th className="px-3 py-3 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => {
                                const userAcc = accounts.find((a) => a.userId === user.id);
                                const trans = transactions.find((a) => a.userId === user.id);
                                const kycdata = kyc.find((a) => a.userId === user.id);
                                return (
                                    <tr
                                        key={user.id}
                                        className="border-b hover:bg-gray-50 text-sm text-gray-800"
                                    >
                                        <td className="px-3 py-3">{user.fullname}</td>
                                        <td className="px-3 py-3">{user.email}</td>
                                        <td className="px-3 py-3">
                                            {formatPhoneNumber(kycdata?.kyc?.phone_number || user.phone_number)}
                                        </td>
                                        <td className="px-3 py-3">
                                            {kycdata?.kyc?.id ? "✅" : "❌"}
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            {userAcc?.accounts?.length || 0}
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            {trans?.transactions?.length || 0}
                                        </td>
                                        <td className="px-3 py-3">
                                            {new Date(user.date_joined).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
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
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
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
