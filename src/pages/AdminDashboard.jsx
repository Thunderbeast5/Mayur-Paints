import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { inventoryAPI, ordersAPI, analyticsAPI, usersAPI, alertsAPI } from '../api'

const sidebarLinks = [
  { key: 'dashboard', icon: 'dashboard',             label: 'Dashboard'  },
  { key: 'products',  icon: 'inventory_2',            label: 'Products'   },
  { key: 'orders',    icon: 'receipt_long',           label: 'Orders'     },
  { key: 'analytics', icon: 'analytics',              label: 'Analytics'  },
  { key: 'customers', icon: 'group',                  label: 'Customers'  },
  { key: 'alerts',    icon: 'notifications_active',   label: 'Alerts'     },
  { key: 'settings',  icon: 'settings',               label: 'Settings'   },
]

const statusColors = {
  delivered: 'text-emerald-400 bg-emerald-400/10', 
  shipped: 'text-blue-400 bg-blue-400/10',
  confirmed: 'text-blue-300 bg-blue-300/10',
  pending: 'text-amber-400 bg-amber-400/10',    
  cancelled: 'text-red-400 bg-red-400/10',
  active: 'text-emerald-400 bg-emerald-400/10',
}

function AdminDashboard({ currentUser, userRole }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab,       setActiveTab]       = useState('dashboard')
  const [productFilter,   setProductFilter]   = useState('All')
  const [inventory,       setInventory]       = useState({ products: [], totalProducts: 0, lowStockItems: 0, totalStockValue: 0 })
  const [orders,          setOrders]          = useState([])
  const [analytics,       setAnalytics]       = useState({ totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, totalCustomers: 0, revenueData: [], topProducts: [], statusBreakdown: {} })
  const [customers,       setCustomers]       = useState([])
  const [alerts,          setAlerts]          = useState({ totalAlerts: 0, critical: 0, high: 0, medium: 0, alerts: [] })
  const [settingsSaved,   setSettingsSaved]   = useState(false)
  const [loading,         setLoading]         = useState(true)

  useEffect(() => { loadData() }, [activeTab])

  async function loadData() {
    setLoading(true)
    try {
      if (activeTab === 'dashboard' || activeTab === 'products') {
        const inv = await inventoryAPI.getSummary()
        console.log('Inventory data:', inv)
        setInventory(inv)
      }
      if (activeTab === 'dashboard' || activeTab === 'orders') {
        const ords = await ordersAPI.getAll(); setOrders(Array.isArray(ords) ? ords : [])
      }
      if (activeTab === 'dashboard' || activeTab === 'analytics') {
        const ana = await analyticsAPI.getAnalytics(); setAnalytics(ana)
      }
      if (activeTab === 'customers') {
        const users = await usersAPI.getAll(); setCustomers(Array.isArray(users) ? users : [])
      }
      if (activeTab === 'alerts') {
        const al = await alertsAPI.getLowStock(); setAlerts(al)
      }
    } catch (e) { 
      console.error('Admin load error:', e)
      console.error('Error details:', e.message)
    }
    setLoading(false)
  }

  function handleAdminLogout() { dispatch(logout()); navigate('/login') }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await ordersAPI.updateStatus(orderId, newStatus)
      const updated = await ordersAPI.getAll()
      setOrders(Array.isArray(updated) ? updated : [])
    } catch (e) { console.error(e) }
  }

  async function handleDeleteProduct(type, id) {
    if (!window.confirm(`Delete this ${type.toLowerCase()}? This cannot be undone.`)) return
    try {
      if (type?.toLowerCase() === 'paint') { const { paintsAPI } = await import('../api'); await paintsAPI.delete(id) }
      else { const { hardwareAPI } = await import('../api'); await hardwareAPI.delete(id) }
      const inv = await inventoryAPI.getSummary(); setInventory(inv)
    } catch (e) { console.error(e) }
  }

  function handleSettingsSave(e) {
    e.preventDefault(); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2500)
  }

  const revenueArray = analytics.monthlyRevenue || analytics.revenueData || []
  const maxRevenue = revenueArray.length > 0 ? Math.max(...revenueArray.map(d => d.revenue || d.value || 0)) : 1
  const filteredProducts = (inventory.products || inventory.data || []).filter(p => productFilter === 'All' || p.type?.toLowerCase() === productFilter.toLowerCase())
  const avgOrderValue = analytics.totalOrders > 0 ? Math.round(analytics.totalRevenue / analytics.totalOrders) : 0

  return (
    <div className="bg-slate-950 font-display text-slate-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 fixed h-full z-30">
        <div className="flex items-center gap-2.5 p-6 border-b border-slate-800/50">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">format_paint</span>
          </div>
          <div><h1 className="text-lg font-black">Mayur Paints</h1><p className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Portal</p></div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((item) => (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.key ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800/50 space-y-1">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-all">
            <span className="material-symbols-outlined text-lg">home</span> View Store
          </Link>
          <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
            <span className="material-symbols-outlined text-lg">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div><h2 className="text-xl font-bold capitalize">{activeTab}</h2><p className="text-xs text-slate-500">Welcome back, Admin</p></div>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('alerts')} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-primary/30 transition-all relative">
              <span className="material-symbols-outlined text-slate-400">notifications</span>
              {alerts.totalAlerts > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[9px] font-bold text-white rounded-full flex items-center justify-center">{alerts.totalAlerts}</span>}
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">admin_panel_settings</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeTab === 'dashboard' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      { icon: 'inventory_2',  label: 'Total Products', value: String(inventory.totalProducts),                          change: `${inventory.lowStockItems} low stock`                    },
                      { icon: 'receipt_long', label: 'Total Orders',   value: String(analytics.totalOrders),                            change: `${analytics.statusBreakdown?.pending || 0} pending` },
                      { icon: 'payments',     label: 'Total Revenue',  value: `₹${((analytics.totalRevenue || 0)/100000).toFixed(1)}L`,         change: `Avg ₹${avgOrderValue.toLocaleString()}`        },
                      { icon: 'group',        label: 'Customers',      value: String(analytics.totalCustomers),                          change: 'Registered users'                                         },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-lg">{stat.icon}</span>
                          </div>
                          <span className="text-xs text-slate-500">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-black">{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold">Revenue Overview</h3>
                        <span className="text-xs text-slate-500">Live from database</span>
                      </div>
                      <div className="flex items-end gap-3 h-48">
                        {(analytics.monthlyRevenue || analytics.revenueData || []).map((d) => {
                          const revenue = d.revenue || d.value || 0
                          return (
                            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-bold">₹{(revenue/1000).toFixed(0)}k</span>
                              <div className="w-full bg-gradient-to-t from-primary to-orange-400 rounded-lg transition-all duration-500 hover:opacity-80" style={{ height: `${(revenue/maxRevenue)*100}%` }}></div>
                              <span className="text-[10px] text-slate-500">{d.month}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="xl:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">Recent Orders</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-primary text-xs font-bold">View All</button>
                      </div>
                      <div className="space-y-3">
                        {(orders || []).slice(0, 5).map((order) => {
                          const customerName = order.customerName || order.user?.name || 'Customer'
                          const total = order.totalAmount || order.total || 0
                          return (
                            <div key={order._id || order.id} className="flex items-center justify-between py-2">
                              <div>
                                <div className="text-sm font-bold">{customerName}</div>
                                <div className="text-[10px] text-slate-500">{order.orderId}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold">₹{total.toLocaleString()}</div>
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[order.status] || ''}`}>{order.status}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* PRODUCTS */}
              {activeTab === 'products' && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">Product Management</h3>
                      <p className="text-sm text-slate-500">{inventory.totalProducts} products · Stock Value: ₹{(inventory.totalStockValue/100000).toFixed(1)}L</p>
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-amber-400 mt-2 space-y-1">
                          <p>DEBUG: filteredProducts.length={filteredProducts.length}</p>
                          <p>inventory.products.length={inventory.products?.length}</p>
                          <p>productFilter="{productFilter}"</p>
                          {inventory.products?.[0] && (
                            <p>Sample product type: "{inventory.products[0].type}" (typeof: {typeof inventory.products[0].type})</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
                      {['All','Paint','Hardware'].map((f) => (
                        <button key={f} onClick={() => setProductFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${productFilter === f ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                          <th className="text-left px-6 py-4">Product</th><th className="text-left px-4 py-4">Type</th>
                          <th className="text-left px-4 py-4">Category</th><th className="text-right px-4 py-4">Price</th>
                          <th className="text-right px-4 py-4">Stock</th><th className="text-center px-4 py-4">Status</th>
                          <th className="text-center px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                              {inventory.products?.length === 0 ? 'No products loaded. Check browser console for errors.' : 'No products match filter.'}
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => {
                            const isLow = p.stock <= (p.minStock || 20)
                            const pid = p._id || p.id
                            return (
                              <tr key={`${p.type}-${pid}`} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-bold">{p.name}</td>
                                <td className="px-4 py-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${p.type?.toLowerCase() === 'paint' ? 'text-primary bg-primary/10' : 'text-emerald-400 bg-emerald-400/10'}`}>{p.type}</span></td>
                                <td className="px-4 py-4 text-slate-400">{p.category}</td>
                                <td className="px-4 py-4 text-right font-bold">₹{p.price.toLocaleString()}</td>
                                <td className={`px-4 py-4 text-right font-bold ${isLow ? 'text-amber-400' : ''}`}>{p.stock}</td>
                                <td className="px-4 py-4 text-center">
                                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${isLow ? 'text-amber-400 bg-amber-400/10' : statusColors[p.status] || statusColors.active}`}>{isLow ? 'Low Stock' : 'Active'}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined text-slate-400 text-lg">edit</span></button>
                                    <button onClick={() => handleDeleteProduct(p.type, pid)} className="p-2 rounded-lg hover:bg-red-400/10 transition-colors"><span className="material-symbols-outlined text-slate-400 hover:text-red-400 text-lg">delete</span></button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="p-6 border-b border-slate-800">
                    <h3 className="font-bold text-lg">Order Management</h3>
                    <p className="text-sm text-slate-500">{orders.length} total orders</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                          <th className="text-left px-6 py-4">Order ID</th><th className="text-left px-4 py-4">Customer</th>
                          <th className="text-left px-4 py-4">Date</th><th className="text-center px-4 py-4">Items</th>
                          <th className="text-right px-4 py-4">Amount</th><th className="text-center px-4 py-4">Status</th>
                          <th className="text-center px-6 py-4">Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {(orders || []).map((order) => {
                          const customerName = order.customerName || order.user?.name || 'Customer'
                          const total = order.totalAmount || order.total || 0
                          return (
                            <tr key={order._id || order.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-6 py-4 font-bold">{order.orderId}</td>
                              <td className="px-4 py-4">{customerName}</td>
                              <td className="px-4 py-4 text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                              <td className="px-4 py-4 text-center">{order.items?.length || 0}</td>
                              <td className="px-4 py-4 text-right font-bold">₹{total.toLocaleString()}</td>
                              <td className="px-4 py-4 text-center"><span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status] || ''}`}>{order.status}</span></td>
                              <td className="px-6 py-4 text-center">
                                <select value={order.status} onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)} className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 focus:border-primary/50 focus:ring-0">
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Total Revenue',   value: `₹${(analytics.totalRevenue || 0).toLocaleString()}`,   period: 'All Time',  icon: 'payments'      },
                      { label: 'Avg Order Value',  value: `₹${avgOrderValue.toLocaleString()}`,  period: 'Per Order', icon: 'shopping_bag'  },
                      { label: 'Total Customers',  value: String(analytics.totalCustomers || 0),                  period: 'Registered',icon: 'group'         },
                    ].map((s) => (
                      <div key={s.label} className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined text-primary">{s.icon}</span></div>
                          <span className="text-[10px] text-slate-500">{s.period}</span>
                        </div>
                        <div className="text-2xl font-black">{s.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <h3 className="font-bold mb-6">Monthly Revenue</h3>
                    <div className="flex items-end gap-4 h-64">
                      {(analytics.monthlyRevenue || analytics.revenueData || []).map((d) => {
                        const revenue = d.revenue || d.value || 0
                        return (
                          <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-xs text-slate-400 font-bold">₹{(revenue/1000).toFixed(0)}k</span>
                            <div className="w-full bg-gradient-to-t from-primary to-orange-400 rounded-xl transition-all duration-500 hover:opacity-80 min-h-[4px]" style={{ height: `${(revenue/maxRevenue)*100}%` }}></div>
                            <span className="text-xs text-slate-500">{d.month}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <h3 className="font-bold mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                      {(analytics.topProducts || []).map((p, i) => {
                        const units = p.totalQuantity || p.units || 0
                        const revenue = p.totalRevenue || p.revenue || 0
                        return (
                          <div key={p._id || p.name || i} className="flex items-center gap-4 py-3">
                            <span className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">{i+1}</span>
                            <div className="flex-1">
                              <div className="text-sm font-bold">{p.name}</div>
                              <div className="text-[10px] text-slate-500">{units} units sold</div>
                            </div>
                            <span className="font-bold text-sm">₹{revenue.toLocaleString()}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="p-6 border-b border-slate-800">
                    <h3 className="font-bold text-lg">Customer Management</h3>
                    <p className="text-sm text-slate-500">{customers.length} registered users</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                          <th className="text-left px-6 py-4">Customer</th><th className="text-left px-4 py-4">Email</th>
                          <th className="text-left px-4 py-4">Role</th><th className="text-center px-4 py-4">Orders</th>
                          <th className="text-right px-4 py-4">Total Spent</th><th className="text-left px-4 py-4">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {(customers || []).map((c) => {
                          const totalOrders = c.orderCount || c.totalOrders || 0
                          const totalSpent = c.totalSpent || 0
                          return (
                            <tr key={c._id || c.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-primary">{c.name?.charAt(0) || 'U'}</span></div>
                                  <span className="font-bold">{c.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-slate-400">{c.email}</td>
                              <td className="px-4 py-4"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.role === 'admin' ? 'text-primary bg-primary/10' : 'text-blue-400 bg-blue-400/10'}`}>{c.role}</span></td>
                              <td className="px-4 py-4 text-center">{totalOrders}</td>
                              <td className="px-4 py-4 text-right font-bold">₹{totalSpent.toLocaleString()}</td>
                              <td className="px-4 py-4 text-slate-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ALERTS */}
              {activeTab === 'alerts' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Alerts',          value: alerts.totalAlerts, color: 'text-slate-300',  bg: 'bg-slate-800'       },
                      { label: 'Critical (Out of Stock)',value: alerts.critical,    color: 'text-red-400',    bg: 'bg-red-400/10'      },
                      { label: 'High (≤5 units)',        value: alerts.high,        color: 'text-amber-400',  bg: 'bg-amber-400/10'    },
                      { label: 'Medium (≤20 units)',     value: alerts.medium,      color: 'text-yellow-400', bg: 'bg-yellow-400/10'   },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} rounded-2xl border border-slate-800 p-5`}>
                        <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="p-5 border-b border-slate-800">
                      <h3 className="font-bold">Low Stock Products</h3>
                      <p className="text-xs text-slate-500 mt-1">Products that need restocking</p>
                    </div>
                    {alerts.alerts?.length === 0 ? (
                      <div className="p-12 text-center text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-2 block text-emerald-400">check_circle</span>
                        All products are well stocked!
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-800">
                        {(alerts.alerts || []).map((a, i) => (
                          <div key={a._id || i} className="flex items-center justify-between px-6 py-4">
                            <div>
                              <div className="font-bold text-sm">{a.name}</div>
                              <div className="text-xs text-slate-500">{a.code} · {a.type === 'paint' ? 'Paint' : 'Hardware'}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className={`text-lg font-black ${a.urgency === 'critical' ? 'text-red-400' : a.urgency === 'high' ? 'text-amber-400' : 'text-yellow-400'}`}>{a.stock}</div>
                                <div className="text-[10px] text-slate-500">units left</div>
                              </div>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${a.urgency === 'critical' ? 'text-red-400 bg-red-400/10' : a.urgency === 'high' ? 'text-amber-400 bg-amber-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>{a.urgency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <h3 className="font-bold text-lg mb-6">Store Settings</h3>
                    {settingsSaved && (
                      <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>Settings saved successfully!
                      </div>
                    )}
                    <form className="space-y-5" onSubmit={handleSettingsSave}>
                      <div className="space-y-2"><label className="text-sm font-semibold text-slate-400">Store Name</label><input className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-primary/50 focus:ring-0" defaultValue="Mayur Paints" /></div>
                      <div className="space-y-2"><label className="text-sm font-semibold text-slate-400">Contact Email</label><input className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-primary/50 focus:ring-0" defaultValue="admin@mayurpaints.com" type="email" /></div>
                      <div className="space-y-2"><label className="text-sm font-semibold text-slate-400">Phone Number</label><input className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-primary/50 focus:ring-0" defaultValue="+91 1800 200 1234" type="tel" /></div>
                      <div className="space-y-2"><label className="text-sm font-semibold text-slate-400">GST Number</label><input className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-primary/50 focus:ring-0" defaultValue="27AADCM0123A1Z5" /></div>
                      <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">Save Settings</button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 z-30 flex items-center justify-around py-3">
        {sidebarLinks.slice(0, 5).map((item) => (
          <button key={item.key} onClick={() => setActiveTab(item.key)} className={`flex flex-col items-center gap-1 ${activeTab === item.key ? 'text-primary' : 'text-slate-500'}`}>
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[9px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default AdminDashboard
