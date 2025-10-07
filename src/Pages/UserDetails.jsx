import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

const UserDetails = () => {
    const { id } = useParams();
    const [selectedAccount, setSelectedAccount] = useState("USD");
    const navigate = useNavigate();

    const [user, setUser] = useState([]);
    const [account, setAccount] = useState([]);
    const [kyc, setKyc] = useState([]);
    // const [balance, setBalance] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("reccurAdminToken")

                const res1 = await fetch(
                    `https://reccur-141b5bf0e007.herokuapp.com/api/v1/dashboard/get_users?user_id=${id}`,
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
                    `https://reccur-141b5bf0e007.herokuapp.com/api/v1/account?user_id=${id}`,
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
                    `https://reccur-141b5bf0e007.herokuapp.com/api/v1/transactions?user_id=${id}`,
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


                // const res5 = await fetch(
                //     `https://reccur-141b5bf0e007.herokuapp.com/api/v1/get_wallet_balance?user_id=${id}`,
                //     {
                //         method: "GET",
                //         headers: {
                //             Authorization: token ? `Token ${token}` : "",
                //         },
                //     }
                // );
                // const data5 = await res5.json()

                // setBalance(data5);
                // console.log(data5)

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
                `https://reccur-141b5bf0e007.herokuapp.com/api/v1/kyc?user_id=${id}`,
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


    const currentAccount = account.find(
        (acc) => acc.currency === selectedAccount
    );

    const flags = {
        USD: "https://flagcdn.com/us.svg",
        EUR: "https://flagcdn.com/eu.svg",
        NGN: "https://flagcdn.com/ng.svg",
    };

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

    return (
        <div className="sm:p-6 p-3 bg-gray-50 min-h-screen">
            {/* User Header */}
            <div onClick={() => navigate('/users')}>
                <IoArrowBack className="text-2xl mb-4 cursor-pointer" />
            </div>
            <div className="bg-white sm:p-6 p-3 rounded-2xl shadow-sm">
                <div className="sm:p-6 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user?.fullname}
                        </h2>
                        <p className="text-gray-600">{user?.email}</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${kyc.id
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {kyc.id ? "KYC Approved" : "KYC Not Apporoved"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Accounts Section */}
            <div className="bg-white sm:p-6 p-3 rounded-2xl shadow-sm mt-6">
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
            </div>

            {/* Transactions Section */}
            <div className="bg-white sm:p-6 p-3 rounded-2xl shadow-sm mt-6">
                <h3 className="font-semibold text-2xl text-gray-800">Transactions</h3>

                {transactions.length === 0 ? (
                    <p className="mt-4 text-gray-500 italic">No transactions found.</p>
                ) : (
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-[500px] border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left text-gray-700 text-base">
                                    <th className="px-3 py-3">Date</th>
                                    <th className="px-3 py-3">Type</th>
                                    <th className="px-3 py-3">Amount</th>
                                    <th className="px-3 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn, i) => (
                                    <tr key={i} className="border-b text-base">
                                        <td className="px-3 py-3">
                                            {new Date(txn.date_created).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-3 py-3">
                                            {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                                        </td>
                                        <td className="px-3 py-3">$ {txn.amount.toLocaleString()}</td>
                                        <td
                                            className={`px-3 py-3 
                                                ${txn.payment.status === "completed" && "text-[#027A48]"}
                                                ${txn.payment.status === "pending" && "text-[#B54708]"}
                                                ${txn.payment.status === "failed" && "text-red-600"}
                                            `}
                                        >
                                            {txn.payment.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;
