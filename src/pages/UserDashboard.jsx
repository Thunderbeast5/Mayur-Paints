import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ordersAPI } from '../api'
import { logout } from '../redux/authSlice'

const sidebarLinks = [
  { key: 'overview',   icon: 'dashboard',     label: 'Overview'    },
  { key: 'orders',     icon: 'receipt_long',  label: 'My Orders'   },
  { key: 'profile',    icon: 'person',        label: 'Profile'     },
  { key: 'addresses',  icon: 'location_on',   label: 'Addresses'   },
  { key: 'wishlist',   icon: 'favorite',      label: 'Wishlist'    },
]

const statusColors = {
  delivered:  'text-emerald-500 bg-emerald-500/10',
  shipped:    'text-blue-500 bg-blue-500/10',
  confirmed:  'text-blue-400 bg-blue-400/10',
  pending:    'text-amber-500 bg-amber-500/10',
  cancelled:  'text-red-500 bg-red-500/10',
}

function UserDashboard({ cartCount, currentUser, onLogout }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileData, setProfileData] = useState(null)
  
  // Address management states
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false
  })
  const [addressSaved, setAddressSaved] = useState(false)

  const user = currentUser || { _id: null, name: 'Guest User', email: 'guest@example.com', phone: '' }

  useEffect(() => {
    setProfileData({ name: user.name, email: user.email, phone: user.phone || '' })
    loadAddresses()
  }, [user.name, user.email, user.phone])

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    setLoading(true)
    try {
      // Don't pass userId - backend uses JWT token to identify user
      const data = await ordersAPI.getAll()
      console.log('Orders loaded:', data)
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
    }
    setLoading(false)
  }

  function loadAddresses() {
    // Load addresses from localStorage (in a real app, this would be from API)
    const savedAddresses = localStorage.getItem('userAddresses')
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses))
    }
  }

  function handleLogoutClick() {
    dispatch(logout())
    if (onLogout) onLogout()
    navigate('/login')
  }

  function handleProfileSave(e) {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  function handleAddressSubmit(e) {
    e.preventDefault()
    
    let newAddresses = [...addresses]
    
    if (editingAddress) {
      // Update existing address
      newAddresses = newAddresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addressForm, id: editingAddress.id }
          : addr
      )
    } else {
      // Add new address
      const newAddress = {
        ...addressForm,
        id: Date.now().toString()
      }
      
      // If this is default, remove default from others
      if (addressForm.isDefault) {
        newAddresses = newAddresses.map(addr => ({ ...addr, isDefault: false }))
      }
      
      newAddresses.push(newAddress)
    }
    
    // If no default address, set first one as default
    if (newAddresses.length > 0 && !newAddresses.some(addr => addr.isDefault)) {
      newAddresses[0].isDefault = true
    }
    
    setAddresses(newAddresses)
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses))
    
    // Reset form
    setAddressForm({
      label: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      isDefault: false
    })
    setShowAddressForm(false)
    setEditingAddress(null)
    setAddressSaved(true)
    setTimeout(() => setAddressSaved(false), 3000)
  }

  function handleEditAddress(address) {
    setEditingAddress(address)
    setAddressForm(address)
    setShowAddressForm(true)
  }

  function handleDeleteAddress(addressId) {
    const newAddresses = addresses.filter(addr => addr.id !== addressId)
    
    // If deleted address was default, set first remaining as default
    if (addresses.find(addr => addr.id === addressId)?.isDefault && newAddresses.length > 0) {
      newAddresses[0].isDefault = true
    }
    
    setAddresses(newAddresses)
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses))
  }

  function handleSetDefault(addressId) {
    const newAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }))
    setAddresses(newAddresses)
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses))
  }

  const stats = {
    totalOrders: orders.length,
    delivered:   orders.filter(o => o.status === 'delivered').length,
    inTransit:   orders.filter(o => o.status === 'shipped' || o.status === 'pending' || o.status === 'confirmed').length,
    totalSpent:  orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalAmount || o.total || 0), 0),
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole="user" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">My Dashboard</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sticky top-24">
              <div className="flex items-center gap-3 p-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">person</span>
                </div>
                <div>
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((item) => (
                  <button key={item.key} onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.key 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
                <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all">
                  <span className="material-symbols-outlined text-lg">logout</span> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                  <>
                    <div className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <h2 className="text-2xl font-black mb-2 relative z-10">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                      <p className="text-white/80 relative z-10">Here's what's happening with your orders.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: 'receipt_long',   label: 'Total Orders', value: stats.totalOrders,                              color: 'text-primary bg-primary/10'         },
                        { icon: 'local_shipping', label: 'In Transit',   value: stats.inTransit,                                color: 'text-blue-500 bg-blue-500/10'       },
                        { icon: 'check_circle',   label: 'Delivered',    value: stats.delivered,                                color: 'text-emerald-500 bg-emerald-500/10' },
                        { icon: 'payments',       label: 'Total Spent',  value: `₹${(stats.totalSpent/1000).toFixed(1)}k`,      color: 'text-amber-500 bg-amber-500/10'     },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                            <span className="material-symbols-outlined text-lg">{stat.icon}</span>
                          </div>
                          <div className="text-2xl font-black">{stat.value}</div>
                          <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-lg">Recent Orders</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-bold hover:underline">View All</button>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 block">shopping_cart</span>
                            <p>No orders yet. <Link to="/paints" className="text-primary font-bold hover:underline">Start shopping</Link>!</p>
                          </div>
                        ) : orders.slice(0, 3).map((order) => (
                          <div key={order._id || order.id} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-400">inventory_2</span>
                              </div>
                              <div>
                                <div className="font-bold text-sm">{order.orderId}</div>
                                <div className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN')} · {order.items.length} items</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">₹{(order.totalAmount || order.total || 0).toLocaleString()}</div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[order.status] || ''}`}>{order.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ORDERS */}
                {activeTab === 'orders' && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-lg">My Orders</h3>
                      <p className="text-sm text-slate-400 mt-1">{orders.length} orders</p>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                          <span className="material-symbols-outlined text-5xl mb-3 block">receipt_long</span>
                          <h3 className="font-bold text-lg mb-2">No orders yet</h3>
                          <Link to="/paints" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors inline-block mt-2">Shop Now</Link>
                        </div>
                      ) : orders.map((order) => (
                        <div key={order._id || order.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-400">inventory_2</span>
                              </div>
                              <div>
                                <div className="font-bold">{order.orderId}</div>
                                <div className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">₹{(order.totalAmount || order.total || 0).toLocaleString()}</div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColors[order.status] || ''}`}>{order.status}</span>
                            </div>
                          </div>
                          <div className="space-y-1 pl-13">
                            {(order.items || []).map((item, i) => (
                              <div key={i} className="flex justify-between text-sm text-slate-500">
                                <span>{item.name} × {item.quantity || item.qty || 1}</span>
                                <span className="font-medium">₹{(item.price * (item.quantity || item.qty || 1)).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          {order.paymentMethod && (
                            <div className="mt-2 text-xs text-slate-400 pl-13">
                              Payment: {order.paymentMethod}
                              {order.shippingAddress && typeof order.shippingAddress === 'object' && 
                                ` · ${order.shippingAddress.street || order.shippingAddress.city || ''}`}
                              {order.shippingAddress && typeof order.shippingAddress === 'string' && 
                                ` · ${order.shippingAddress.substring(0, 50)}...`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROFILE */}
                {activeTab === 'profile' && profileData && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                    <h3 className="font-bold text-lg mb-6">Personal Information</h3>
                    {profileSaved && (
                      <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Profile updated successfully!
                      </div>
                    )}
                    <form className="space-y-6 max-w-xl" onSubmit={handleProfileSave}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                          <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary/50 focus:ring-0 transition-colors" value={profileData.name} onChange={e => setProfileData(p => ({...p, name: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Phone</label>
                          <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary/50 focus:ring-0 transition-colors" value={profileData.phone} onChange={e => setProfileData(p => ({...p, phone: e.target.value}))} type="tel" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
                        <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary/50 focus:ring-0 transition-colors" value={profileData.email} onChange={e => setProfileData(p => ({...p, email: e.target.value}))} type="email" />
                      </div>
                      <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Save Changes</button>
                    </form>
                  </div>
                )}

                {/* ADDRESSES */}
                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Saved Addresses</h3>
                        <button 
                          onClick={() => setShowAddressForm(true)}
                          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span> Add Address
                        </button>
                      </div>

                      {addressSaved && (
                        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          Address saved successfully!
                        </div>
                      )}

                      {showAddressForm && (
                        <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <h4 className="font-bold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                          <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Label (Home, Office, etc.)</label>
                                <input
                                  type="text"
                                  required
                                  value={addressForm.label}
                                  onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-0"
                                  placeholder="Home"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <input
                                  type="tel"
                                  required
                                  value={addressForm.phone}
                                  onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-0"
                                  placeholder="+91 98765 43210"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Street Address</label>
                              <textarea
                                required
                                value={addressForm.street}
                                onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-0"
                                rows="2"
                                placeholder="123, Main Street, Apartment 4B"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">City</label>
                                <input
                                  type="text"
                                  required
                                  value={addressForm.city}
                                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-0"
                                  placeholder="Mumbai"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">State</label>
                                <input
                                  type="text"
                                  required
                                  value={addressForm.state}
                                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-0"
                                  placeholder="Maharashtra"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Pincode</label>
                                <input
                                  type="text"
                                  required
                                  value={addressForm.pincode}
                                  onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-0"
                                  placeholder="400001"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="isDefault"
                                checked={addressForm.isDefault}
                                onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                              />
                              <label htmlFor="isDefault" className="text-sm font-medium">Set as default address</label>
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="submit"
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                              >
                                {editingAddress ? 'Update Address' : 'Save Address'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddressForm(false)
                                  setEditingAddress(null)
                                  setAddressForm({
                                    label: '',
                                    street: '',
                                    city: '',
                                    state: '',
                                    pincode: '',
                                    phone: '',
                                    isDefault: false
                                  })
                                }}
                                className="px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {addresses.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                          <span className="material-symbols-outlined text-5xl mb-3 block">location_off</span>
                          <h3 className="font-bold text-lg mb-2">No saved addresses</h3>
                          <p className="text-sm mb-4">Add your first address to make checkout faster</p>
                          <button 
                            onClick={() => setShowAddressForm(true)}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                          >
                            Add Your First Address
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {addresses.map((addr) => (
                            <div key={addr.id} className={`bg-slate-50 dark:bg-slate-800 rounded-xl p-6 ${addr.isDefault ? 'border-2 border-primary/30' : ''}`}>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-lg">{addr.label}</span>
                                  {addr.isDefault && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">Default</span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  {!addr.isDefault && (
                                    <button 
                                      onClick={() => handleSetDefault(addr.id)}
                                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                      title="Set as default"
                                    >
                                      <span className="material-symbols-outlined text-slate-400 text-lg">star</span>
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleEditAddress(addr)}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-slate-400 text-lg">edit</span>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-slate-400 hover:text-red-500 text-lg">delete</span>
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                <p>{addr.street}</p>
                                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                <p>📞 {addr.phone}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* WISHLIST */}
                {activeTab === 'wishlist' && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
                    <h3 className="font-bold text-lg mb-6">My Wishlist</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'Royale Luxury Emulsion',    code: 'RP-101', price: 4850, color: '#E6E6FA', link: '/paints' },
                        { name: 'Arctic Shield Weather Coat', code: 'EX-810', price: 3200, color: '#ecf0f1', link: '/paints' },
                        { name: 'Professional Brush Set',     code: 'MB-100', price: 450,  color: null,      link: '/hardware' },
                      ].map((item) => (
                        <div key={item.code} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all">
                          <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                            {item.color ? <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.color }}></div> : <span className="material-symbols-outlined text-slate-400">construction</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm truncate">{item.name}</div>
                            <div className="text-xs text-slate-400">{item.code}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">₹{item.price.toLocaleString()}</div>
                            <Link to={item.link} className="text-primary text-xs font-bold hover:underline">Shop Now</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default UserDashboard
