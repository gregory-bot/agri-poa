import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Leaf,
  Heart,
  Cloud,
  Activity,
  AlertTriangle
} from 'lucide-react';

const RealTimeDashboard = ({ language }) => {
  const [dashboardData, setDashboardData] = useState({
    totalScans: 1247,
    activeUsers: 342,
    successRate: 94.5,
    diseaseDetections: 89,
    soilAnalyses: 156,
    animalDiagnoses: 67
  });

  const [chartData, setChartData] = useState({
    weeklyScans: [],
    cropDiseases: [],
    soilTypes: [],
    animalHealth: []
  });

  // Simulate real-time data updates
  useEffect(() => {
    const generateWeeklyData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => ({
        day,
        scans: Math.floor(Math.random() * 100) + 50,
        diseases: Math.floor(Math.random() * 30) + 10,
        soil: Math.floor(Math.random() * 40) + 20
      }));
    };

    const generateCropDiseaseData = () => [
      { name: 'Blight', value: 35, color: '#ef4444' },
      { name: 'Rust', value: 25, color: '#f97316' },
      { name: 'Mildew', value: 20, color: '#eab308' },
      { name: 'Wilt', value: 15, color: '#22c55e' },
      { name: 'Others', value: 5, color: '#6366f1' }
    ];

    const generateSoilData = () => [
      { type: 'Clay', percentage: 30, ph: 6.5 },
      { type: 'Loam', percentage: 45, ph: 7.0 },
      { type: 'Sandy', percentage: 20, ph: 6.8 },
      { type: 'Silt', percentage: 5, ph: 7.2 }
    ];

    const generateAnimalData = () => [
      { animal: 'Cattle', healthy: 85, sick: 15 },
      { animal: 'Goats', healthy: 92, sick: 8 },
      { animal: 'Sheep', healthy: 88, sick: 12 },
      { animal: 'Pigs', healthy: 90, sick: 10 },
      { animal: 'Poultry', healthy: 95, sick: 5 }
    ];

    setChartData({
      weeklyScans: generateWeeklyData(),
      cropDiseases: generateCropDiseaseData(),
      soilTypes: generateSoilData(),
      animalHealth: generateAnimalData()
    });

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        totalScans: prev.totalScans + Math.floor(Math.random() * 5),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        successRate: Math.min(99, prev.successRate + (Math.random() - 0.5) * 0.5)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Real-Time Dashboard</h2>
        <p className="text-gray-600">
          Monitor your agricultural platform performance and analytics in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatCard
          icon={Activity}
          title="Total Scans"
          value={dashboardData.totalScans.toLocaleString()}
          change={5.2}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value={dashboardData.activeUsers}
          change={2.1}
          color="bg-green-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Success Rate"
          value={`${dashboardData.successRate}%`}
          change={0.8}
          color="bg-purple-500"
        />
        <StatCard
          icon={AlertTriangle}
          title="Disease Detections"
          value={dashboardData.diseaseDetections}
          change={-1.2}
          color="bg-red-500"
        />
        <StatCard
          icon={Cloud}
          title="Soil Analyses"
          value={dashboardData.soilAnalyses}
          change={3.4}
          color="bg-amber-500"
        />
        <StatCard
          icon={Heart}
          title="Animal Diagnoses"
          value={dashboardData.animalDiagnoses}
          change={1.8}
          color="bg-pink-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Scans Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.weeklyScans}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="scans" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="diseases" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="soil" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Crop Diseases Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Disease Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.cropDiseases}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.cropDiseases.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Soil Types Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Soil Type Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.soilTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="percentage" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Animal Health Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Animal Health Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.animalHealth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="animal" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="healthy" stackId="a" fill="#10b981" />
              <Bar dataKey="sick" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Real-time Updates Indicator */}
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Live Updates</span>
      </div>
    </div>
  );
};

export default RealTimeDashboard;