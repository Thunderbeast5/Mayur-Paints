import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { couponsAPI, addressAPI } from '../api'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, userRole, currentUser }) {
  const [step, setStep] = useState(1)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')
  const navigate = useNavigate()

  const [newAddress, setNewAddress] = useState({
    label: '',
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  })

  useEffect(() => {
    if (currentUser && step === 2) {
      loadAddresses()
    }
  }, [currentUser, step])

  const loadAddresses = async () => {
    try {
      const data = await addressAPI.getAll()
      setAddresses(data)
      if (data.length > 0) {
        const defaultAddr = data.find(a => a.isDefault) || data[0]
        setSelectedAddress(defaultAddr)
      }
    } catch (error) {
      console.error('Failed to load addresses:', error)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const tax = Math.round(subtotal * 0.18)
  const delivery = subtotal > 999 ? 0 : (paymentMethod === 'cod' ? 249 : 199)
  const total = subtotal + tax + delivery - discount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    try {
      const result = await couponsAPI.validate(couponCode, subtotal)
      if (result.success) {
        setDiscount(result.discount)
        setAppliedCoupon(result.coupon)
        toast.success(`Coupon applied! You saved ₹${result.discount}`)
      }
    } catch (error) {
      toast.error(error.message || 'Invalid coupon code')
    }
  }

  const handleRemoveCoupon = () => {
    setDiscount(0)
    setAppliedCoupon(null)
    setCouponCode('')
    toast.success('Coupon removed')
  }

  const handleSaveAddress = async () => {
    // Validation
    if (!newAddress.label || !newAddress.name || !newAddress.phone || 
        !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all required fields')
      return
    }

    if (!currentUser) {
      toast.error('Please login to save address')
      navigate('/login')
      return
    }

    try {
      console.log('Saving address:', newAddress)
      const result = await addressAPI.add(newAddress)
      console.log('Address saved:', result)
      
      await loadAddresses()
      
      // Reset form
      setNewAddress({
        label: '',
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      })
      
      setShowAddressForm(false)
      toast.success('Address saved successfully!')
    } catch (error) {
      console.error('Address save error:', error)
      toast.error(error.message || 'Failed to save address')
    }
  }

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }
    setStep(3)
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      toast.error('Please login to place order')
      navigate('/login')
      return
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    setLoading(true)

    try {
      // Format shipping address for Order model
      const formattedAddress = {
        street: `${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}`,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        phone: selectedAddress.phone
      }
      
      console.log('Placing order with address:', formattedAddress)
      
      const orderData = {
        userId: currentUser._id || currentUser.id,
        items: cartItems.map(item => ({
          productId: item.id,
          type: item.type,
          name: item.name,
          qty: item.qty,
          price: item.price
        })),
        shippingAddress: formattedAddress,
        paymentMethod: paymentMethod === 'online' ? 'QR Code' : 'COD',
        couponCode: appliedCoupon?.code
      }

      const order = await onCheckout(formattedAddress, orderData.paymentMethod)
      
      if (order) {
        // If online payment, redirect to payment page with QR code
        if (paymentMethod === 'online') {
          navigate('/payment', {
            state: {
              orderId: order._id,
              amount: total,
              shippingAddress: {
                fullName: selectedAddress.name,
                phone: selectedAddress.phone,
                addressLine1: selectedAddress.addressLine1,
                addressLine2: selectedAddress.addressLine2,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pincode: selectedAddress.pincode
              }
            }
          })
        } else {
          // COD - show success
          setOrderId(order.orderId)
          setOrderComplete(true)
          triggerConfetti()
          toast.success('Order placed successfully!')
        }
      }
    } catch (error) {
      console.error('Order placement error:', error)
      toast.error(error.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar cartCount={cartItems.length} userRole={userRole} />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2">Thank you for your purchase</p>
            <p className="text-2xl font-bold text-primary mb-8">Order ID: {orderId}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                View Order Details
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar cartCount={0} userRole={userRole} />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <button
            onClick={() => navigate('/paints')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Shop Paints
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cartItems.length} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s}
                </div>
                {idx < 2 && <div className={`w-24 h-1 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2">
            <span className="text-sm font-medium">Cart</span>
            <span className="text-sm font-medium">Address</span>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Shopping Cart ({cartItems.length} items)</h2>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <p className="text-lg font-bold text-primary mt-2">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                          <span className="text-xl">×</span>
                        </button>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.qty - 1))} className="px-3 py-1 hover:bg-gray-100">−</button>
                          <span className="px-3 font-semibold">{item.qty}</span>
                          <button onClick={() => onUpdateQuantity(item.id, item.qty + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
                  Proceed to Address
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
                {addresses.length > 0 && !showAddressForm && (
                  <div className="space-y-3 mb-6">
                    {addresses.map(addr => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedAddress?._id === addr._id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{addr.label || 'Address'}</p>
                          {addr.isDefault && (
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="font-medium">{addr.name}</p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                        <p className="text-sm text-gray-600">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {showAddressForm && (
                  <div className="space-y-4 mb-6">
                    <input type="text" placeholder="Label (e.g., Home, Office)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                    <input type="text" placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                    <input type="tel" placeholder="Phone Number" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                    <input type="text" placeholder="Address Line 1" value={newAddress.addressLine1} onChange={e => setNewAddress({...newAddress, addressLine1: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                    <input type="text" placeholder="Address Line 2 (Optional)" value={newAddress.addressLine2} onChange={e => setNewAddress({...newAddress, addressLine2: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="px-4 py-3 border border-gray-300 rounded-lg" />
                      <input type="text" placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="px-4 py-3 border border-gray-300 rounded-lg" />
                    </div>
                    <input type="text" placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="setDefault" 
                        checked={newAddress.isDefault} 
                        onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} 
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <label htmlFor="setDefault" className="text-sm text-gray-700">Set as default address</label>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSaveAddress} className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold">Save Address</button>
                      <button onClick={() => setShowAddressForm(false)} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">Cancel</button>
                    </div>
                  </div>
                )}
                
                {!showAddressForm && (
                  <button onClick={() => setShowAddressForm(true)} className="w-full mb-6 border-2 border-dashed border-gray-300 py-3 rounded-lg font-semibold text-gray-600 hover:border-primary hover:text-primary transition">
                    + Add New Address
                  </button>
                )}
                
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">Back</button>
                  <button onClick={handleProceedToPayment} className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  <div
                    onClick={() => setPaymentMethod('online')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'online' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                        {paymentMethod === 'online' && <div className="w-full h-full rounded-full bg-white scale-50" />}
                      </div>
                      <div>
                        <p className="font-semibold">Online Payment</p>
                        <p className="text-sm text-gray-600">UPI, Cards, Net Banking, Wallets</p>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'cod' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                        {paymentMethod === 'cod' && <div className="w-full h-full rounded-full bg-white scale-50" />}
                      </div>
                      <div>
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive (₹50 extra charge)</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50">
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>

              {step === 1 && (
                <div className="mt-6">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Have a coupon?</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-green-700 font-semibold">{appliedCoupon.code}</span>
                      <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <button onClick={handleApplyCoupon} className="px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition">
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
