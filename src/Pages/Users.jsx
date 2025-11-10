import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { BiSearch } from "react-icons/bi";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function getInitials(name) {
        if (!name) return "";
        const parts = name.trim().split(" ");
        const initials = parts
            .slice(0, 2) // Take only first two words
            .map((p) => p.charAt(0).toUpperCase())
            .join("");
        return initials;
    }

    useEffect(() => {
        const fetchUsersAndData = async () => {
            try {
                const token = localStorage.getItem("reccurAdminToken");
                const res = await fetch(
                    `https://api.reccur.co/api/v1/get_all_user_details`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: token ? `Token ${token}` : "",
                        },
                    }
                );
                const data = await res.json();
                setUsers(data || []);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndData();
    }, []);

    const filterUsers = users.filter((user) => {
        const name = user?.user?.fullname ? user.user.fullname.toLowerCase() : "";
        const email = user?.user?.email ? user.user.email.toLowerCase() : "";
        const phone = user?.user?.phone_number ? user.user.phone_number.toLowerCase() : "";
        const term = search.toLowerCase();

        return (
            name.includes(term) ||
            email.includes(term) ||
            phone.includes(term)
        );
    });

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
            <div className="flex mt-40 justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <p className="sm:p-10 p-5 text-red-600">{error}</p>;
    }

    return (
        <div className="sm:p-10 p-5 rounded-2xl shadow-sm">
            <div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Users</h2>
                </div>
                <p className="mt-2 text-gray-600 font-normal">{users.length} total users</p>
            </div>

            <div className="rounded-[10px] bg-white p-3 mt-5 border-[1.3px] border-purple-100">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-purple-200 outline-none p-2 py-[6px] pl-9 bg-gray-100 rounded-[10px] w-full"
                        placeholder="Search by name, email or phone..."
                    />
                    <BiSearch className="absolute top-1/2 -translate-y-1/2 left-3" />
                </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-[10px] border" style={{ WebkitOverflowScrolling: "touch" }}>
                <table className="w-full min-w-[1000px] text-nowrap border-collapse">
                    <thead>
                        <tr className="bg-[#f6eeff] text-left text-gray-700 text-sm">
                            <th className="px-3 py-3">Full Name</th>
                            <th className="px-3 py-3">Email</th>
                            <th className="px-3 py-3">Phone</th>
                            <th className="px-3 py-3">KYC Status</th>
                            <th className="px-3 py-3">Bank Account</th>
                            <th className="px-3 py-3 text-center">Transactions Made</th>
                            <th className="px-3 py-3">Date Joined</th>
                            <th className="px-3 py-3 text-end"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            filterUsers.map((user) => {
                                return (
                                    <tr
                                        key={user.id}
                                        onClick={() => {
                                            window.scrollTo(0, 0)
                                            navigate(`/users/${user?.user.id}`)
                                        }}
                                        className="border-b hover:bg-purple-50 cursor-pointer text-sm text-gray-800"
                                    >
                                        <td className="px-3 py-3 flex items-center gap-2">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                                                {getInitials(user?.user.fullname)}
                                            </div>
                                            <span>{user?.user.fullname}</span>
                                        </td>
                                        <td className="px-3 py-3">{user?.user.email}</td>
                                        <td className="px-3 py-3">
                                            {formatPhoneNumber(user?.user.phone_number)}
                                        </td>
                                        <td className="px-3 py-3">
                                            {user?.kyc ? (
                                                <p className="inline-flex rounded-[8px] py-1 px-2 font-semibold text-green-500 bg-green-100">
                                                    Approved
                                                </p>
                                            ) : (
                                                <p className="inline-flex rounded-[8px] py-1 px-2 font-semibold bg-[#edeff5]">
                                                    Pending
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-3 py-3">
                                            {user?.accounts > 0 ? (
                                                <p className="inline-flex rounded-[8px] py-1 px-2 font-semibold text-purple-500 bg-purple-100">
                                                    Created
                                                </p>
                                            ) : (
                                                <p className="inline-flex rounded-[8px] py-1 px-2 font-semibold bg-[#edeff5]">
                                                    Not Created
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            {user?.transactions || 0}
                                        </td>
                                        <td className="px-3 py-3">
                                            {new Date(user?.user.date_joined).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-3 py-3 text-end">
                                            <p className="px-3 py-1 text-base rounded-lg">
                                                <IoIosArrowForward />
                                            </p>
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
