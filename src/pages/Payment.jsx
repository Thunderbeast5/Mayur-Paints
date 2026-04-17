import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

export default function Payment({ cartCount, userRole }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user: currentUser } = useSelector(s => s.auth)
  
  const [step, setStep] = useState(1) // 1: QR Code, 2: Upload Screenshot, 3: Confirmation
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  
  const orderData = location.state?.orderData
  const orderId = location.state?.orderId
  const amount = location.state?.amount
  const shippingAddress = location.state?.shippingAddress

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to continue')
      navigate('/login')
      return
    }

    if (!orderId || !amount) {
      toast.error('Invalid payment request')
      navigate('/cart')
      return
    }

    // Check if address is provided
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
      toast.error('Please provide shipping address')
      navigate('/cart', { state: { requiresAddress: true } })
      return
    }

    generateQRCode()
  }, [])

  async function generateQRCode() {
    setLoading(true)
    try {
      const token = localStorage.getItem('mp_token')
      const response = await fetch('http://localhost:3001/api/payments/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          amount,
          shippingAddress
        })
      })

      const data = await response.json()

      if (data.success) {
        setPayment(data.data)
        setStep(1)
      } else {
        if (data.requiresAddress) {
          toast.error('Please provide complete shipping address')
          navigate('/cart', { state: { requiresAddress: true } })
        } else {
          toast.error(data.message || 'Failed to generate QR code')
          navigate('/cart')
        }
      }
    } catch (error) {
      console.error('Generate QR error:', error)
      toast.error('Failed to generate QR code')
      navigate('/cart')
    }
    setLoading(false)
  }

  function handleScreenshotChange(e) {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      setScreenshot(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshotPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmitScreenshot() {
    if (!screenshot) {
      toast.error('Please select a screenshot')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('mp_token')
      const formData = new FormData()
      formData.append('screenshot', screenshot)

      const response = await fetch(`http://localhost:3001/api/payments/${payment._id}/upload-screenshot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setPayment(data.data)
        setStep(3)
        toast.success('Payment submitted successfully!')
      } else {
        toast.error(data.message || 'Failed to upload screenshot')
      }
    } catch (error) {
      console.error('Upload screenshot error:', error)
      toast.error('Failed to upload screenshot')
    }
    setLoading(false)
  }

  if (loading && !payment) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar cartCount={cartCount} userRole={userRole} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Generating QR Code...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!payment) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar cartCount={cartCount} userRole={userRole} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 ${
                  step > s ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Scan QR Code */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">
                Scan QR Code to Pay
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Payment Number: <span className="font-bold text-primary">{payment.paymentNumber}</span>
              </p>
            </div>

            {/* QR Code Display */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                  <img 
                    src={payment.qrCode} 
                    alt="Payment QR Code"
                    className="w-64 h-64"
                  />
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Scan to pay with any UPI app
                  </p>
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined">account_balance</span>
                    <span className="text-sm">Mayur Paints</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 w-full max-w-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400">UPI ID:</span>
                    <span className="font-bold">{payment.paymentDetails?.upiId || 'mayurpaints@upi'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Amount:</span>
                    <span className="text-2xl font-black text-primary">₹{payment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                Payment Instructions
              </h3>
              <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Scan the QR code above</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Verify the amount: ₹{payment.amount.toLocaleString()}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>Complete the payment</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">5.</span>
                  <span>Take a screenshot of the payment confirmation</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all"
            >
              I've Made the Payment - Upload Screenshot
            </button>
          </div>
        )}

        {/* Step 2: Upload Screenshot */}
        {step === 2 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">
                Upload Payment Screenshot
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Upload proof of payment for verification
              </p>
            </div>

            {/* Upload Area */}
            <div className="mb-8">
              <label className="block font-bold mb-4">Payment Screenshot *</label>
              
              {!screenshotPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary transition-all bg-slate-50 dark:bg-slate-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">cloud_upload</span>
                    <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG or GIF (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    className="w-full h-auto rounded-xl border-2 border-slate-200 dark:border-slate-700"
                  />
                  <button
                    onClick={() => {
                      setScreenshot(null)
                      setScreenshotPreview(null)
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8">
              <h3 className="font-bold mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Payment Number</span>
                  <span className="font-bold">{payment.paymentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Amount Paid</span>
                  <span className="font-bold text-primary">₹{payment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">UPI ID</span>
                  <span className="font-bold">{payment.paymentDetails?.upiId || 'mayurpaints@upi'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold hover:border-primary transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmitScreenshot}
                disabled={!screenshot || loading}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-4">
              Payment Submitted Successfully!
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Your payment is pending admin verification
            </p>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Payment Number</span>
                  <span className="font-bold">{payment.paymentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Amount</span>
                  <span className="font-bold text-primary">₹{payment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Status</span>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-bold">
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                What's Next?
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Our admin team will verify your payment within 24 hours</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>You'll receive a notification once verified</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Track your payment status in your dashboard</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Your order will be processed after payment verification</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold hover:border-primary transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
