import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [analytics, setAnalytics] = useState({
    overview: {},
    sales: [],
    topProducts: [],
    categories: [],
    orders: [],
    users: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Mock API call - replace with actual API
      const mockData = {
        overview: {
          totalRevenue: 2456789,
          totalOrders: 1234,
          totalUsers: 5678,
          conversionRate: 3.4,
          avgOrderValue: 1992,
          growth: {
            revenue: 23.5,
            orders: 18.2,
            users: 31.7
          }
        },
        sales: [
          { date: '2024-01-01', revenue: 45000, orders: 23 },
          { date: '2024-01-02', revenue: 52000, orders: 28 },
          { date: '2024-01-03', revenue: 48000, orders: 25 },
          { date: '2024-01-04', revenue: 61000, orders: 32 },
          { date: '2024-01-05', revenue: 58000, orders: 30 },
          { date: '2024-01-06', revenue: 67000, orders: 35 },
          { date: '2024-01-07', revenue: 72000, orders: 38 }
        ],
        topProducts: [
          { name: 'Premium Interior Emulsion', sales: 234, revenue: 567890, code: 'PI-101' },
          { name: 'Exterior Weather Shield', sales: 189, revenue: 445670, code: 'EW-201' },
          { name: 'Waterproofing Solution', sales: 156, revenue: 378900, code: 'WS-301' },
          { name: 'Primer Base Coat', sales: 145, revenue: 234500, code: 'PB-401' },
          { name: 'Gloss Finish Paint', sales: 134, revenue: 198760, code: 'GF-501' }
        ],
        categories: [
          { name: 'Interior', value: 45, revenue: 1234567 },
          { name: 'Exterior', value: 30, revenue: 890123 },
          { name: 'Waterproofing', value: 15, revenue: 445678 },
          { name: 'Hardware', value: 10, revenue: 234567 }
        ],
        orders: [
          { status: 'Delivered', count: 892, percentage: 72.3 },
          { status: 'Processing', count: 234, percentage: 19.0 },
          { status: 'Shipped', count: 89, percentage: 7.2 },
          { status: 'Pending', count: 19, percentage: 1.5 }
        ],
        users: [
          { type: 'New Users', count: 1234, growth: 31.7 },
          { type: 'Active Users', count: 3456, growth: 18.2 },
          { type: 'Premium Users', count: 987, growth: 45.3 }
        ]
      }
      
      // Simulate API delay
      setTimeout(() => {
        setAnalytics(mockData)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, growth, icon, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900 rounded-xl flex items-center justify-center`}>
          <span className="material-symbols-outlined text-2xl text-${color}-600 dark:text-${color}-400">
            {icon}
          </span>
        </div>
        {growth && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            growth > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="material-symbols-outlined text-lg">
              {growth > 0 ? 'trending_up' : 'trending_down'}
            </span>
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </p>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-12"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-3/4"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${analytics.overview.totalRevenue?.toLocaleString('en-IN')}`}
          growth={analytics.overview.growth?.revenue}
          icon="payments"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={analytics.overview.totalOrders}
          growth={analytics.overview.growth?.orders}
          icon="shopping_cart"
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={analytics.overview.totalUsers}
          growth={analytics.overview.growth?.users}
          icon="people"
          color="purple"
        />
        <StatCard
          title="Conversion Rate"
          value={`${analytics.overview.conversionRate}%`}
          growth={analytics.overview.growth?.conversion}
          icon="trending_up"
          color="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
        >
          <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">
            Revenue & Orders Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Revenue (₹)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={2}
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
        >
          <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">
            Sales by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analytics.categories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-slate-700 dark:text-slate-300">{category.name}</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  ₹{category.revenue.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
        >
          <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">
            Top Selling Products
          </h2>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={product.code} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{product.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">
                    ₹{product.revenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {product.sales} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
        >
          <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">
            Order Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.orders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="status" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analytics.orders.map((order) => (
              <div key={order.status} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">{order.status}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {order.count} orders
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({order.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
      >
        <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">
          User Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics.users.map((userType) => (
            <div key={userType.type} className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                {userType.type}
              </h3>
              <p className="text-3xl font-bold text-primary mb-2">
                {userType.count.toLocaleString()}
              </p>
              <div className={`flex items-center justify-center gap-1 text-sm font-medium ${
                userType.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="material-symbols-outlined text-lg">
                  {userType.growth > 0 ? 'trending_up' : 'trending_down'}
                </span>
                {Math.abs(userType.growth)}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AnalyticsDashboard
