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
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [signUpData, setSignUpData] = useState([]);
  const [totalClient, setTotalClient] = useState({});
  const [userJourney, setUserJourney] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("reccurAdminToken");

    const fetchData = async () => {
      setLoading(true); // start loader
      try {
        // Fetch signup data
        const res1 = await fetch(
          "https://reccur-141b5bf0e007.herokuapp.com/api/v1/get_signup_data",
          {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data1 = await res1.json();
        setSignUpData(data1);

        // Fetch total clients
        const res2 = await fetch(
          "https://reccur-141b5bf0e007.herokuapp.com/api/v1/get_total_clients",
          {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data2 = await res2.json();
        setTotalClient(data2);

        // Fetch user journey
        const res3 = await fetch(
          "https://reccur-141b5bf0e007.herokuapp.com/api/v1/get_user_journey",
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
        setLoading(false); // stop loader regardless of success/failure
      }
    };

    fetchData();
  }, []);

  // Compute percentages relative to total signups
  const totalSignups = userJourney.length > 0 ? userJourney[0].count : 1;
  const journeyData = userJourney.map((d) => ({
    ...d,
    percentage: ((d.count / totalSignups) * 100).toFixed(1),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-14 space-y-8 bg-gray-50 min-h-screen">
      {/* User Signups Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">📊 User Signups</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6">
          <div className="text-base sm:text-lg">
            <p className="font-semibold">Total Users</p>
            <p className="text-blue-600 text-xl sm:text-2xl">
              {totalClient.total_clients}
            </p>
          </div>
          <div className="text-base sm:text-lg">
            <p className="font-semibold">New Users Today</p>
            <p className="text-green-600 text-xl sm:text-2xl">
              {totalClient.total_signups_today}
            </p>
          </div>
        </div>

        <div className="w-full h-64 sm:h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={signUpData}>
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
      </div>

      {/* User Journey Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">👤 User Journey</h2>
        <div className="w-full h-64 sm:h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={journeyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4f46e5" name="Users">
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
    </div>
  );
};

export default Dashboard;
