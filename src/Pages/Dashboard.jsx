import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";
import { GoPeople } from "react-icons/go";
import { FaArrowUpLong, FaUserCheck } from "react-icons/fa6";
import { LuCreditCard } from "react-icons/lu";
import { IoMdTrendingUp } from "react-icons/io";

const data = [
  { day: "Mon", volume: 1200 },
  { day: "Tue", volume: 2100 },
  { day: "Wed", volume: 1800 },
  { day: "Thu", volume: 2600 },
  { day: "Fri", volume: 3100 },
  { day: "Sat", volume: 1500 },
  { day: "Sun", volume: 900 },
];

const currencyData = [
  { name: "USD", value: 70 },
  { name: "EUR", value: 30 },
];

const Dashboard = () => {
  const [signUpData, setSignUpData] = useState([]);
  const [totalClient, setTotalClient] = useState({});
  const [userJourney, setUserJourney] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState("7");
  const COLORS = ["#A855F7", "#D8B4FE"];

  useEffect(() => {
    const token = localStorage.getItem("reccurAdminToken");

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch signup data with selected range as query param
        const res1 = await fetch(
          `https://api.reccur.co/api/v1/get_signup_data?days=${selectedRange}`,
          {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data1 = await res1.json();
        setSignUpData(data1);

        // Fetch other data if needed
        const res2 = await fetch(
          `https://api.reccur.co/api/v1/get_total_clients?days=${selectedRange}`,
          {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data2 = await res2.json();
        setTotalClient(data2);

        const res3 = await fetch(
          `https://api.reccur.co/api/v1/get_user_journey?days=${selectedRange}`,
          {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data3 = await res3.json();
        setUserJourney(data3);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRange]);


  // Compute percentages relative to total signups
  // const totalSignups = userJourney.length > 0 ? userJourney[0].count : 1;
  // const journeyData = userJourney.map((d) => ({
  //   ...d,
  //   percentage: ((d.count / totalSignups) * 100).toFixed(1),
  // }));

  const signedUp = userJourney.find(d => d.stage === "Signed Up")?.count || 0;
  const completedKYA = userJourney.find(d => d.stage === "Completed KYA")?.count || 0;
  const acctCreated = userJourney.find(d => d.stage === "Bank Account Created")?.count || 0;
  const transactionsMade = userJourney.find(d => d.stage === "Made Transaction")?.count || 0;

  const kycCompletionRate = signedUp > 0 ? ((completedKYA / signedUp) * 100).toFixed(0) + "%" : "0%";
  const signupRate = signedUp > 0 ? ((signedUp / signedUp) * 100).toFixed(0) + "%" : "0%";
  const acctCreatedRate = signedUp > 0 ? ((acctCreated / signedUp) * 100).toFixed(0) + "%" : "0%";
  const transactionsMadeRate = signedUp > 0 ? ((transactionsMade / signedUp) * 100).toFixed(0) + "%" : "0%";

  const percentageOfNewUsersToday = totalClient.total_clients > 0 ? ((totalClient.total_signups_today / totalClient.total_clients) * 100).toFixed(2) : 0

  if (loading) {
    return (
      <div className="flex mt-40 justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="sm:p-10 p-5 min-h-screen space-y-8">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center items-start gap-4">
        <div className="space-y-2">
          <p className="font-semibold text-lg">Dashboard Overview</p>
          <p className="font-normal text-black/60">Monitor your Reccur platform performance</p>
        </div>
        <div>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-gray-200 rounded-[10px] border-[1.5px] border-purple-200 p-3 w-[170px]"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid mc:grid-cols-4 sm:grid-cols-3 sp:grid-cols-2 sp:justify-center sm:gap-5 gap-3 items-start">
        <div className="text-black/50 w-full sm:p-5 p-3 h-full rounded-2xl flex flex-col justify-between border-[1.5px] border-purple-200 bg-white hover:border-[1.8px] transition-all duration-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <p className="sm:text-[16px] text-[13px]">Total Users</p>
            </div>
            <div className="bg-[#e9dbef] rounded-lg text-[#6741e4] text-xl sm:p-2 p-1">
              <GoPeople />
            </div>
          </div>
          <div className="">
            <p className="sm:text-4xl text-[22px] text-black font-[450]">{totalClient.total_clients}</p>
            <div className="text-[#0FA726] flex items-center rounded-[20px] font-normal mt-2 gap-3">
              <p className="text-[15px] flex items-center gap3">
                <FaArrowUpLong />
                1.74%
              </p>
            </div>
          </div>
        </div>

        <div className="text-black/50 w-full sm:p-5 p-3 h-full rounded-2xl flex flex-col justify-between border-[1.5px] border-purple-200 bg-white hover:border-[1.8px] transition-all duration-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <p className="sm:text-[16px] text-[13px]">New Users Today</p>
            </div>
            <div className="bg-[#e9dbef] rounded-lg text-[#6741e4] text-xl sm:p-2 p-1">
              <FaUserCheck />
            </div>
          </div>
          <div className="">
            <p className="sm:text-4xl text-[22px] text-black font-[450]">{totalClient.total_signups_today}</p>
            <div className="text-black/50 mt-2 flex items-center rounded-[20px] font-normal gap-3">
              <p className="text-[15px] flex items-center gap3">{percentageOfNewUsersToday}% of total</p>
            </div>
          </div>
        </div>

        <div className="text-black/50 w-full sm:p-5 p-3 h-full rounded-2xl flex flex-col justify-between border-[1.5px] border-purple-200 bg-white hover:border-[1.8px] transition-all duration-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <p className="sm:text-[16px] text-[13px]">Total Transaction Volume</p>
            </div>
            <div className="bg-[#e9dbef] rounded-lg text-[#6741e4] text-xl sm:p-2 p-1">
              <IoMdTrendingUp />
            </div>
          </div>
          <div className="">
            <p className="sm:text-4xl text-[22px] text-black font-[450]">$55,555</p>
            <div className="text-[#0FA726] flex items-center rounded-[20px] font-normal gap-3 mt-2">
              <p className="text-[15px] flex items-center gap-1">
                <FaArrowUpLong />
                1.74%
              </p>
            </div>
          </div>
        </div>

        <div className="text-black/50 w-full sm:p-5 p-3 h-full rounded-2xl flex flex-col justify-between border-[1.5px] border-purple-200 bg-white hover:border-[1.8px] transition-all duration-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <p className="sm:text-[16px] text-[13px]">KYC Completion Rate</p>
            </div>
            <div className="bg-[#e9dbef] rounded-lg text-[#6741e4] text-xl sm:p-2 p-1">
              <LuCreditCard />
            </div>
          </div>
          <p className="sm:text-4xl text-[22px] text-black font-[450]">{kycCompletionRate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📈 Sign-Up Chart */}
        <div className="w-full h-[354px] sm:h-[396px] md:h-[450px] p-4 pb-14 bg-white rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Daily User Signups
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={signUpData}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newUsers" fill="#82ca9d" name="Daily New Users" />
              <LabelList dataKey="newUsers" position="top" />
              <Line
                type="monotone"
                dataKey="totalUsers"
                stroke="#8884d8"
                name="Total Users"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 💰 Transaction Chart */}
        <div className="w-full h-[354px] sm:h-[396px] md:h-[450px] p-4 pb-14 bg-white rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Daily Transaction Volume
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-full p-5 bg-white rounded-2xl shadow-md space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            User Conversion Funnel
          </h2>

          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between gap-3">
              <p className="text-black/70">Total Users</p>
              <p>{signedUp} ({signupRate})</p>
            </div>
            <div className="w-full h-[14px] rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 transition-all duration-700 ease-out"
                style={{ width: signupRate }}
              ></div>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between gap-3">
              <p className="text-black/70">KYC Approved</p>
              <p>{completedKYA} ({kycCompletionRate})</p>
            </div>
            <div className="w-full h-[14px] rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 transition-all duration-700 ease-out"
                style={{ width: kycCompletionRate }}
              ></div>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between gap-3">
              <p className="text-black/70">Account Created</p>
              <p>{acctCreated} ({acctCreatedRate})</p>
            </div>
            <div className="w-full h-[14px] rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 transition-all duration-700 ease-out"
                style={{ width: acctCreatedRate }}
              ></div>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between gap-3">
              <p className="text-black/70">Has Transactions</p>
              <p>{transactionsMade} ({transactionsMadeRate})</p>
            </div>
            <div className="w-full h-[14px] rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 transition-all duration-700 ease-out"
                style={{ width: transactionsMadeRate }}
              ></div>
            </div>
          </div>
        </div>

        <div className="w-full h-[354px] sm:h-[396px] md:h-[450px] p-4 pb-14 bg-white rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Currency Distribution
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {currencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Creation Rate */}
        <div className="p-5 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
          <p className="text-base text-gray-500">Account Creation Rate</p>
          <h3 className="text-2xl font-semibold text-gray-800 mt-2">{acctCreatedRate}</h3>
          <div className="w-full h-[10px] mt-2 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 transition-all duration-700 ease-out"
              style={{ width: acctCreatedRate }}
            ></div>
          </div>
        </div>

        {/* Transaction Rate */}
        <div className="p-5 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
          <p className="text-base text-gray-500">Transaction Rate</p>
          <h3 className="text-2xl font-semibold text-gray-800 mt-2">{transactionsMadeRate}</h3>
          <div className="w-full h-[10px] mt-2 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 transition-all duration-700 ease-out"
              style={{ width: transactionsMadeRate }}
            ></div>
          </div>
        </div>

        {/* Average Transaction Value */}
        <div className="p-5 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
          <p className="text-base text-gray-500">Average Transaction Value</p>
          <h3 className="text-2xl font-semibold text-gray-800 mt-2">$113,194</h3>
          <p className="mt-2 text-black/60">per transactions</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
