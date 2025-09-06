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

  useEffect(() => {
    const token = localStorage.getItem("reccurAdminToken");
    const fetchSignUpData = async () => {
      try {
        const res = await fetch(
          "https://reccur-141b5bf0e007.herokuapp.com/api/v1/get_signup_data",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const data = await res.json();
        setSignUpData(data);
      } catch (error) {
        console.error("Error fetching sign up data:", error);
      }
    };

    fetchSignUpData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("reccurAdminToken");
    const fetchTotalClient = async () => {
      try {
        const res = await fetch(
          "https://reccur-141b5bf0e007.herokuapp.com/api/v1/get_total_clients",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const data = await res.json();
        setTotalClient(data);
      } catch (error) {
        console.error("Error fetching total clients:", error);
      }
    };

    fetchTotalClient();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("reccurAdminToken");

    const fetchUserJourney = async () => {
      try {
        const res = await fetch(
          "https://reccur-141b5bf0e007.herokuapp.com/api/v1/get_user_journey",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const data = await res.json();
        setUserJourney(data);
      } catch (error) {
        console.error("Error fetching user journey:", error);
      }
    };

    fetchUserJourney();
  }, []);

  // Compute percentages relative to total signups
  const totalSignups = userJourney.length > 0 ? userJourney[0].count : 1;
  const journeyData = userJourney.map((d) => ({
    ...d,
    percentage: ((d.count / totalSignups) * 100).toFixed(1),
  }));

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
