import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import {
    FiMail,
    FiPhone,
    FiCalendar,
    FiCreditCard,
    FiArrowDownLeft,
    FiArrowUpRight,
} from "react-icons/fi";

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState([]);
    const [account, setAccount] = useState([]);
    const [kyc, setKyc] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [error, setError] = useState(null);
    // const [message, setMessage] = useState({ state: '', message: '' });
    // const [balance, setBalance] = useState([]);
    // const [loadingDelete, setLoadingDelete] = useState(false);
    // const [selectedAccount, setSelectedAccount] = useState("USD");

    // const handleDeleteAccount = async () => {

    //     setLoadingDelete(true)
    //     try {
    //         const token = localStorage.getItem('reccurAdminToken')

    //         if (!token) return

    //         const res = await fetch(
    //             `https://api.reccur.co/api/v1/account/${id}`,
    //             {
    //                 method: 'DELETE',
    //                 headers: {
    //                     Authorization: `Token ${token}`,
    //                     Accept: 'application/json',
    //                 },
    //             }
    //         )

    //         if (!res.ok) {
    //             const data = await res.json()
    //             throw new Error(data.message || 'Account deletion failed')
    //         }

    //         setMessage({ state: 'success', message: 'Account deleted successfully.' })

    //         setTimeout(() => {
    //             setShowConfirmModal(false);
    //             navigate('/users');
    //         }, 2000);

    //     } catch (err) {
    //         console.error('Delete failed:', err)
    //         setMessage({ state: 'error', message: err.message || 'Account deletion failed.' })
    //     } finally {
    //         setLoadingDelete(false)
    //         setTimeout(() => {
    //             setMessage({ state: '', message: '' });
    //         }, 3000);
    //     }
    // }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("reccurAdminToken")

                const res1 = await fetch(
                    `https://api.reccur.co/api/v1/dashboard/get_users?user_id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: token ? `Token ${token}` : "",
                        },
                    }
                );
                const data1 = await res1.json()

                setUser(data1[0]);
                console.log(data1);

                const res2 = await fetch(
                    `https://api.reccur.co/api/v1/account?user_id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: token ? `Token ${token}` : "",
                        },
                    }
                );
                const data2 = await res2.json()

                setAccount(data2);
                console.log(data2);

                const res3 = await fetch(
                    `https://api.reccur.co/api/v1/transactions?user_id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: token ? `Token ${token}` : "",
                        },
                    }
                );
                const data3 = await res3.json()

                setTransactions(data3);
                console.log(data3);

            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [id]);

    useEffect(() => {
        const fetchkyc = async () => {
            const token = localStorage.getItem("reccurAdminToken")
            const res4 = await fetch(
                `https://api.reccur.co/api/v1/kyc?user_id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: token ? `Token ${token}` : "",
                    },
                }
            );
            const data4 = await res4.json()

            setKyc(data4);
            console.log(data4);
        }
        fetchkyc()
    }, [id])

    const USDAccount = account.find(
        (acc) => acc.currency === "USD"
    );

    const EURAccount = account.find(
        (acc) => acc.currency === "EUR"
    );

    // const flags = {
    //     USD: "https://flagcdn.com/us.svg",
    //     EUR: "https://flagcdn.com/eu.svg",
    //     NGN: "https://flagcdn.com/ng.svg",
    // };

    const roundUp = (value, decimals = 2) => {
        const factor = Math.pow(10, decimals);
        return Math.ceil(value * factor) / factor;
    };

    const exchangeRates = {
        USD: 1,       // base
        EUR: 0.85,    // example rate
    };

    const convertBalance = (amount, fromCurrency, toCurrency) => {
        if (!amount || !fromCurrency || !toCurrency) return 0;
        const inUSD = amount / exchangeRates[fromCurrency]; // convert to USD first
        return inUSD * exchangeRates[toCurrency];           // convert to target
    };

    function getInitials(name) {
        if (!name) return "";
        const parts = name.trim().split(" ");
        const initials = parts
            .slice(0, 2) // Take only first two words
            .map((p) => p.charAt(0).toUpperCase())
            .join("");
        return initials;
    }

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
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <div className="sm:p-10 p-5 bg-gray-50 min-h-screen">
            {/* User Header */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div onClick={() => navigate('/')}>
                        <IoArrowBack className="text-2xl cursor-pointer" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
                        <p className="text-sm text-gray-500 mt-1">Complete profile information</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowConfirmModal(true)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md"
                >
                    Delete
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

                {/* Profile */}
                <div className="flex items-center gap-4">
                    <div className="sm:w-16 w-10 sm:h-16 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl font-semibold text-purple-700">
                        {getInitials(user?.fullname)}
                    </div>
                    <div>
                        <h3 className="sm:text-lg font-semibold text-gray-900">{user?.fullname}</h3>
                        <div className="flex sp:flex-row flex-col sp:items-center items-start gap-2 mt-1">
                            <span
                                className={`px-2 py-0.5 rounded-full text-sm font-semibold ${kyc.id
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {kyc.id ? "KYC Approved" : "KYC Not Apporoved"}
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-sm font-semibold ${user?.is_active
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {user?.is_active ? "Account Active" : "Account Inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <FiMail className="text-purple-500 w-5 h-5 bg-purple-100" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Email</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <FiPhone className="text-purple-500 w-5 h-5 bg-purple-100" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Phone</p>
                            <p className="text-sm text-gray-600">{formatPhoneNumber(kyc?.phone_number)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <FiCalendar className="text-purple-500 w-5 h-5 bg-purple-100" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Signup Date</p>
                            <p className="text-sm text-gray-600">
                                {new Date(user?.date_joined).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                        <FiTrendingUp className="text-purple-500 w-5 h-5 bg-purple-100" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Transaction Status</p>
                            <p className="text-sm text-gray-600">Active</p>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-4">
                {/* USD Account */}
                <div className="bg-[#f8f6fb] p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                        <FiCreditCard className="text-purple-600 w-5 h-5" />
                        <p className="text-purple-700 font-medium">USD Account</p>
                    </div>
                    <p className="text-gray-600">Account Number</p>
                    <p className="font-semibold text-gray-900 mb-2">{USDAccount.routing_number}</p>
                    <p className="text-gray-600">Currency</p>
                    <p className="font-semibold text-gray-900">United States Dollar</p>
                    <p className="mt-2 text-gray-700">
                        Balance:{" "}
                        <span className="font-bold text-gray-900">
                            {USDAccount.currency}{" "}
                            {roundUp(
                                convertBalance(user.wallet_balance, "USD", USDAccount.currency),
                                1
                            )}
                        </span>
                    </p>
                </div>

                {/* EUR Account */}
                <div className="bg-[#f8f6fb] p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                        <FiCreditCard className="text-purple-600 w-5 h-5" />
                        <p className="text-purple-700 font-medium">EUR Account</p>
                    </div>
                    <p className="text-gray-600">Account Number</p>
                    <p className="font-semibold text-gray-900 mb-2">{EURAccount.iban}</p>
                    <p className="text-gray-600">Currency</p>
                    <p className="font-semibold text-gray-900">Euro</p>
                    <p className="mt-2 text-gray-700">
                        Balance:{" "}
                        <span className="font-bold text-gray-900">
                            {EURAccount.currency}{" "}
                            {roundUp(
                                convertBalance(user.wallet_balance, "USD", EURAccount.currency),
                                1
                            )}
                        </span>
                    </p>
                </div>
            </div>

            {/* Accounts Section */}
            {/* <div className="bg-white sm:p-6 p-3 rounded-2xl shadow-sm mt-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-2xl">Bank Accounts</h3>
                    <div className="flex space-x-0 mt-3 border border-black/50 rounded-lg overflow-hidden">
                        {account.map((acc, idx) => (
                            <button
                                key={acc.type}
                                onClick={() => setSelectedAccount(acc.currency)}
                                className={`px-4 py-3 text-sm font-medium transition-colors duration-200
                                        ${selectedAccount === acc.currency
                                        ? "bg-[#080280] text-white"
                                        : "text-gray-600 bg-transparent"}
                                        ${idx === 0 ? "rounded-l-lg" : ""}
                                        ${idx === account.length - 1 ? "rounded-r-lg" : ""}
                                    `}
                            >
                                {acc.currency} Account
                            </button>
                        ))}
                    </div>
                </div>
                {account.length === 0 ? (
                    <p className="mt-4 text-gray-500 italic">No accounts available for this user.</p>
                ) : (
                    <>


                        {currentAccount && (
                            <div className="mt-4 border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                                <div className="flex items-start space-x-3">
                                    <img
                                        src={flags[currentAccount.currency]}
                                        alt={`${currentAccount.currency} flag`}
                                        className="w-8 h-8 rounded-sm"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800 text-xl">
                                            {currentAccount.currency} Account
                                        </p>
                                        <p className="text-lg text-gray-600">{currentAccount.number}</p>
                                        <p className="mt-2 text-gray-700">
                                            Balance:{" "}
                                            <span className="font-bold text-xl text-gray-900">
                                                {currentAccount.currency}{" "}
                                                {roundUp(
                                                    convertBalance(user.wallet_balance, "USD", currentAccount.currency),
                                                    1
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div> */}

            {/* Transactions Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Transaction Information</h2>

                {/* Total Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-purple-50 p-5 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Total Received</p>
                        <p className="text-2xl font-semibold text-gray-900">$45,320.50</p>
                    </div>
                    <div className="bg-purple-50 p-5 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Transaction Count</p>
                        <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Last Transactions */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Last Transactions</h3>
                    <div className="space-y-3">
                        {transactions.map((txn, i) => {
                            const isReceived = txn.type.toLowerCase() === "received";
                            const bgColor = isReceived ? "bg-green-100" : "bg-red-100";
                            const iconColor = isReceived ? "text-green-600" : "text-red-600";
                            const sign = isReceived ? "+" : "-";

                            return (
                                <div
                                    key={i}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-xl"
                                >
                                    <div className="flex items-start gap-3 mb-3 sm:mb-0">
                                        <div
                                            className={`${bgColor} w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0`}
                                        >
                                            {isReceived ? (
                                                <FiArrowDownLeft className={`${iconColor} w-5 h-5`} />
                                            ) : (
                                                <FiArrowUpRight className={`${iconColor} w-5 h-5`} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {isReceived
                                                    ? `Received from ${txn?.payment.beneficiary?.full_name}`
                                                    : `Transfer to ${txn?.payment.beneficiary?.full_name}`}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(txn.date_created).toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md mt-1 inline-block">
                                                {txn.payment.cryptocurrency_type
                                                    ? txn.payment.cryptocurrency_type + " Transfer"
                                                    : "USD Transfer"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className={`${iconColor} font-semibold text-right`}>
                                        {sign} $ {txn.amount.toLocaleString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] relative">
                        {/* <p className={`${message.state === 'success' ? 'bg-green-500 text-white' : message.state === 'error' ? 'bg-red-500 text-white' : null} p-2 rounded-[10px] mx-auto top-[-50px] left-1/2 -translate-x-1/2 absolute`}>{message.message}</p> */}
                        <h3 className="text-lg font-semibold text-gray-800">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Are you sure you want to delete this user's account? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    // await handleDeleteAccount();
                                }}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700`}
                            // className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${loadingDelete ? "opacity-50 cursor-not-allowed" : ""}`}
                            // disabled={loadingDelete}
                            >
                                {/* {loadingDelete ? "Deleting..." : "Yes, Delete"} */}
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetails;
