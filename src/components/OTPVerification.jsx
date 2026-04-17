import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api'
import toast from 'react-hot-toast'

export default function OTPVerification({ email, tempUser, type = 'login', onSuccess, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60)
  const inputRefs = useRef([])
  const navigate = useNavigate()

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value) {
      const fullOtp = newOtp.join('')
      if (fullOtp.length === 6) {
        handleVerify(fullOtp)
      }
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        const newOtp = [...otp]
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit
        })
        setOtp(newOtp)
        
        // Focus last filled input or first empty
        const lastIndex = Math.min(digits.length, 5)
        inputRefs.current[lastIndex]?.focus()

        // Auto-submit if complete
        if (digits.length === 6) {
          handleVerify(digits.join(''))
        }
      })
    }
  }

  const handleVerify = async (otpCode = null) => {
    const otpValue = otpCode || otp.join('')

    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits')
      return
    }

    setLoading(true)

    try {
      const result = await authAPI.verifyOTP(email, otpValue, tempUser)

      if (result.success) {
        toast.success(type === 'register' ? 'Registration successful!' : 'Login successful!')
        
        // Store auth data
        localStorage.setItem('mp_token', result.data.token)
        localStorage.setItem('mp_user', JSON.stringify(result.data.user))
        localStorage.setItem('mp_role', result.data.role)

        // Call success callback or navigate
        if (onSuccess) {
          onSuccess(result.data)
        } else {
          navigate(result.data.role === 'admin' ? '/admin' : '/dashboard')
        }
      }
    } catch (error) {
      toast.error(error.message || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    try {
      await authAPI.resendOTP(email)
      toast.success('New OTP sent to your email')
      setTimeLeft(300)
      setCanResend(false)
      setResendCooldown(60)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">mail</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-center text-slate-600 mb-8">
            We've sent a 6-digit code to<br />
            <span className="font-semibold text-slate-900">{email}</span>
          </p>

          {/* OTP Input */}
          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                disabled={loading}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            {timeLeft > 0 ? (
              <p className="text-sm text-slate-600">
                Code expires in{' '}
                <span className="font-bold text-primary">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-600 font-semibold">
                OTP expired. Please request a new one.
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verifying...
              </span>
            ) : (
              'Verify OTP'
            )}
          </button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="text-primary font-semibold text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              {canResend ? (
                'Resend OTP'
              ) : (
                `Resend in ${resendCooldown}s`
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-amber-600 text-xl flex-shrink-0">lock</span>
              <div>
                <p className="text-xs text-amber-900 font-semibold mb-1">Security Notice</p>
                <p className="text-xs text-amber-800">
                  Never share your OTP with anyone. Mayur Paints will never ask for your OTP via phone or email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Need help?{' '}
          <a href="mailto:support@mayurpaints.com" className="text-primary font-semibold hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}
