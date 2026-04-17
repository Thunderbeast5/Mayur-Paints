import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

export default function AdminPayments({ cartCount, userRole }) {
  const navigate = useNavigate()
  const { user: currentUser } = useSelector(s => s.auth)
  
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('submitted') // submitted, all
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!currentUser || userRole !== 'admin') {
      toast.error('Admin access required')
      navigate('/login')
      return
    }
    
    loadPayments()
  }, [filter])

  async function loadPayments() {
    setLoading(true)
    try {
      const token = localStorage.getItem('mp_token')
      const endpoint = filter === 'submitted' 
        ? 'http://localhost:3001/api/payments/admin/pending'
        : 'http://localhost:3001/api/payments/admin/all'
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setPayments(data.data)
      } else {
        toast.error(data.message || 'Failed to load payments')
      }
    } catch (error) {
      console.error('Load payments error:', error)
      toast.error('Failed to load payments')
    }
    setLoading(false)
  }

  async function handleVerifyPayment(paymentId) {
    if (!confirm('Are you sure you want to verify this payment?')) return

    setActionLoading(true)
    try {
      const token = localStorage.getItem('mp_token')
      const response = await fetch(`http://localhost:3001/api/payments/${paymentId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Payment verified successfully!')
        loadPayments()
        setSelectedPayment(null)
      } else {
        toast.error(data.message || 'Failed to verify payment')
      }
    } catch (error) {
      console.error('Verify payment error:', error)
      toast.error('Failed to verify payment')
    }
    setActionLoading(false)
  }

  async function handleRejectPayment() {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    setActionLoading(true)
    try {
      const token = localStorage.getItem('mp_token')
      const response = await fetch(`http://localhost:3001/api/payments/${selectedPayment._id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Payment rejected')
        loadPayments()
        setSelectedPayment(null)
        setShowRejectModal(false)
        setRejectionReason('')
      } else {
        toast.error(data.message || 'Failed to reject payment')
      }
    } catch (error) {
      console.error('Reject payment error:', error)
      toast.error('Failed to reject payment')
    }
    setActionLoading(false)
  }

  function getStatusBadge(status) {
    const styles = {
      pending: 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300',
      submitted: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      verified: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar cartCount={cartCount} userRole={userRole} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
              Payment Verification
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage and verify customer payments
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('submitted')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filter === 'submitted'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Pending ({payments.filter(p => p.status === 'submitted').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Payments
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">payments</span>
            <h2 className="text-2xl font-black mb-4">No Payments Found</h2>
            <p className="text-slate-600 dark:text-slate-400">
              {filter === 'submitted' ? 'No pending payments to verify' : 'No payments in the system'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                        {payment.paymentNumber}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Submitted: {new Date(payment.submittedAt || payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-primary">
                      ₹{payment.amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-sm text-slate-600 dark:text-slate-400">Customer Details</h4>
                    <div className="space-y-1">
                      <p className="font-bold">{payment.user?.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{payment.user?.email}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{payment.user?.phone}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-sm text-slate-600 dark:text-slate-400">Shipping Address</h4>
                    <div className="text-sm">
                      <p className="font-bold">{payment.shippingAddress?.fullName}</p>
                      <p className="text-slate-600 dark:text-slate-400">{payment.shippingAddress?.phone}</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {payment.shippingAddress?.addressLine1}, {payment.shippingAddress?.city}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {payment.shippingAddress?.state} - {payment.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot */}
                {payment.paymentScreenshot && (
                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Payment Screenshot</h4>
                    <div className="relative inline-block">
                      <img
                        src={`http://localhost:3001/${payment.paymentScreenshot}`}
                        alt="Payment screenshot"
                        className="max-w-md w-full h-auto rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary transition-all"
                        onClick={() => window.open(`http://localhost:3001/${payment.paymentScreenshot}`, '_blank')}
                      />
                      <button
                        onClick={() => window.open(`http://localhost:3001/${payment.paymentScreenshot}`, '_blank')}
                        className="absolute top-2 right-2 bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      >
                        <span className="material-symbols-outlined">open_in_new</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {payment.status === 'rejected' && payment.rejectionReason && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                    <h4 className="font-bold text-red-900 dark:text-red-100 mb-2">Rejection Reason</h4>
                    <p className="text-sm text-red-800 dark:text-red-200">{payment.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                {payment.status === 'submitted' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerifyPayment(payment._id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">check_circle</span>
                      Verify Payment
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPayment(payment)
                        setShowRejectModal(true)
                      }}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">cancel</span>
                      Reject Payment
                    </button>
                  </div>
                )}

                {payment.status === 'verified' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span className="font-bold">Payment Verified</span>
                      {payment.verifiedAt && (
                        <span className="text-sm">
                          on {new Date(payment.verifiedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-black mb-4">Reject Payment</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Please provide a reason for rejecting this payment. The customer will see this message.
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Screenshot is unclear, amount mismatch, invalid transaction..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-0 mb-4"
              rows="4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                  setSelectedPayment(null)
                }}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-3 rounded-xl font-bold hover:border-primary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                disabled={!rejectionReason.trim() || actionLoading}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
