import { useParams } from "react-router-dom";
import { useState } from "react";

const UserDetails = () => {
    const { id } = useParams();
    const [selectedAccount, setSelectedAccount] = useState("USD");

    // Dummy single user data
    const user = {
        id,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        kyc: true,
        accounts: [
            { type: "USD", number: "234568001", balance: 12500.75 },
            { type: "EUR", number: "345670002", balance: 8900.50 },
        ],
        transactions: [
            {
                date: "Jan 6, 2025",
                amount: 5000,
                status: "Completed",
                ref: "TXN23456801",
            },
            {
                date: "Feb 1, 2025",
                amount: 1200,
                status: "Pending",
                ref: "TXN67890123",
            },
        ],
    };

    const currentAccount = user.accounts.find(
        (acc) => acc.type === selectedAccount
    );

    const flags = {
        USD: "https://flagcdn.com/us.svg",
        EUR: "https://flagcdn.com/eu.svg",
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* User Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${user.kyc
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.kyc ? "KYC Approved" : "KYC Pending"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Accounts Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-2xl">Bank Accounts</h3>

                    {/* Tabs */}
                    <div className="flex space-x-0 mt-3 border border-black/50 rounded-lg overflow-hidden">
                        {user.accounts.map((acc, idx) => (
                            <button
                                key={acc.type}
                                onClick={() => setSelectedAccount(acc.type)}
                                className={`px-4 py-3 text-sm font-medium transition-colors duration-200
                                    ${selectedAccount === acc.type
                                        ? "bg-[#080280] text-white"
                                        : "text-gray-600 bg-transparent"}
                                    ${idx === 0 ? "rounded-l-lg" : ""}
                                    ${idx === user.accounts.length - 1 ? "rounded-r-lg" : ""}
                                `}
                            >
                                {acc.type} Account
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Account Card */}
                {currentAccount && (
                    <div className="mt-4 border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                        <div className="flex items-start space-x-3">
                            <img
                                src={flags[currentAccount.type]}
                                alt={`${currentAccount.type} flag`}
                                className="w-8 h-8 rounded-sm"
                            />
                            <div>
                                <p className="font-medium text-gray-800 text-xl">
                                    {currentAccount.type} Account
                                </p>
                                <p className="text-lg text-gray-600">
                                    {currentAccount.number}
                                </p>
                                <p className="mt-2 text-gray-700">
                                    Balance:{" "}
                                    <span className="font-bold text-xl text-gray-900">
                                        {currentAccount.type}{" "}
                                        {currentAccount.balance.toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Transactions Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
                <h3 className="font-semibold text-2xl text-gray-800">Transactions</h3>
                <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[500px] border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700 text-base">
                                <th className="px-3 py-3">Date</th>
                                <th className="px-3 py-3">Amount</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3">Ref ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.transactions.map((txn, i) => (
                                <tr key={i} className="border-b text-base">
                                    <td className="px-3 py-3">{txn.date}</td>
                                    <td className="px-3 py-3">
                                        {selectedAccount} {txn.amount.toLocaleString()}
                                    </td>
                                    <td
                                        className={`px-3 py-3 ${txn.status === "Completed"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                            }`}
                                    >
                                        {txn.status}
                                    </td>
                                    <td className="px-3 py-3">{txn.ref}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
