import {
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    BarChart,
    LabelList,
} from "recharts";
import Logo from '../Images/Logo base2.svg';

const Dashboard = () => {
    // Dummy data for user signups
    const signupData = [
        { date: "2025-08-28", newUsers: 10, totalUsers: 10 },
        { date: "2025-08-29", newUsers: 20, totalUsers: 30 },
        { date: "2025-08-30", newUsers: 15, totalUsers: 45 },
        { date: "2025-08-31", newUsers: 25, totalUsers: 70 },
        { date: "2025-09-01", newUsers: 30, totalUsers: 100 },
        { date: "2025-09-02", newUsers: 40, totalUsers: 140 },
        { date: "2025-09-03", newUsers: 32, totalUsers: 172 },
    ];

    // Dummy data for user journey tracking
    const journeyDataRaw = [
        { stage: "Signed Up", count: 172 },
        { stage: "Completed KYA", count: 130 },
        { stage: "Bank Account Created", count: 95 },
        { stage: "Made Transaction", count: 60 },
    ];

    // Compute percentages relative to total signups
    const totalSignups = journeyDataRaw[0].count;
    const journeyData = journeyDataRaw.map((d) => ({
        ...d,
        percentage: ((d.count / totalSignups) * 100).toFixed(1),
    }));

    const totalUsers = signupData[signupData.length - 1].totalUsers;
    const newUsersToday = signupData[signupData.length - 1].newUsers;

    return (
        <div className="p-14 space-y-8 bg-gray-50 min-h-screen">
            <div className='flex items-center justify-between 3xl:ml-10'>
                <a href="/">
                    <div className='flex gap-2 items-center'>
                        <img className='3xl:size-10' src={Logo} alt="" />
                        <p className='text-[#1D1C1F] sp:text-[20px] text-[18px] 3xl:text-[35px] font-semibold'>reccur</p>
                    </div>
                </a>
            </div>
            {/* User Signups Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold mb-4">📊 User Signups</h2>
                <div className="flex gap-8 mb-6">
                    <div className="text-lg">
                        <p className="font-semibold">Total Users</p>
                        <p className="text-blue-600 text-2xl">{totalUsers}</p>
                    </div>
                    <div className="text-lg">
                        <p className="font-semibold">New Users Today</p>
                        <p className="text-green-600 text-2xl">{newUsersToday}</p>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={signupData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="newUsers" fill="#82ca9d" name="Daily New Users" />
                        <Line
                            type="monotone"
                            dataKey="totalUsers"
                            stroke="#8884d8"
                            name="Total Users"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* User Journey Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold mb-4">👤 User Journey</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={journeyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stage" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#4f46e5" name="Users">
                            {/* ✅ show percentage labels above bars */}
                            <LabelList
                                dataKey="percentage"
                                position="top"
                                formatter={(val) => `${val}%`}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
