import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api'
import OTPVerification from '../components/OTPVerification'
import toast from 'react-hot-toast'

function SignUp() {
  const [accountType, setAccountType] = useState('retail')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [tempUser, setTempUser] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }
    if (!name || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const result = await authAPI.register({
        name,
        email,
        password,
        phone: phone ? `+91 ${phone}` : '',
        role: 'user',
      })
      
      if (result.success && result.requiresOTP) {
        toast.success('OTP sent to your email!')
        setTempUser(result.tempUser)
        setShowOTP(true)
      } else if (result.success && result.data) {
        // Registration successful without OTP
        toast.success('Account created successfully!')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        throw new Error(result.message || 'Registration failed')
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.'
      
      // Provide helpful error messages
      if (errorMessage.includes('already registered') || errorMessage.includes('Email already')) {
        setError('This email is already registered. Please login instead.')
        toast.error('Email already registered. Try logging in.')
      } else {
        setError(errorMessage)
        toast.error(errorMessage)
      }
    }
    setLoading(false)
  }

  const handleOTPSuccess = (response) => {
    if (response.success) {
      toast.success('Account created successfully!')
      setTimeout(() => navigate('/login'), 1500)
    }
  }

  const handleBackFromOTP = () => {
    setShowOTP(false)
    setTempUser(null)
  }

  if (showOTP) {
    return <OTPVerification email={email} tempUser={tempUser} onSuccess={handleOTPSuccess} onBack={handleBackFromOTP} />
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden neumorphic-card rounded-xl">

        {/* ── Left Side: Branding Panel ── */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-end p-12 overflow-hidden bg-primary/10">
          <div className="absolute inset-0 z-0">
            <img
              alt="Professional painter applying vibrant orange paint to a modern interior wall"
              className="w-full h-full object-cover mix-blend-overlay opacity-40"
              src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=800&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 text-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-primary text-4xl">🎨</span>
              <h2 className="text-3xl font-bold tracking-tight">Mayur Paints</h2>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4 italic">
              Coloring your dreams with lasting quality.
            </h1>
            <p className="text-slate-300 text-lg max-w-sm">
              Join over 10,000+ professionals and homeowners who trust Mayur for their masterpiece.
            </p>
          </div>
        </div>

        {/* ── Right Side: Sign Up Form ── */}
        <div className="lg:col-span-7 bg-background-light dark:bg-background-dark p-6 md:p-12 flex flex-col">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              <div className="h-1.5 w-12 rounded-full bg-primary"></div>
              <div className="h-1.5 w-12 rounded-full bg-primary/20"></div>
              <div className="h-1.5 w-12 rounded-full bg-primary/20"></div>
            </div>
            <span className="text-slate-500 text-sm font-medium">Step 1 of 3</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400">Join the Mayur community today.</p>
          </div>

          {/* Account Type Toggle */}
          <div className="flex p-1.5 mb-10 neumorphic-card rounded-xl max-w-md">
            <button
              type="button"
              onClick={() => setAccountType('retail')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                accountType === 'retail'
                  ? 'bg-primary text-white shadow-neumorphic-raised'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Retail Buyer
            </button>
            <button
              type="button"
              onClick={() => setAccountType('contractor')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                accountType === 'contractor'
                  ? 'bg-primary text-white shadow-neumorphic-raised'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Professional Contractor
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form className="space-y-6 flex-grow" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name *</label>
              <input
                className="w-full px-5 py-4 rounded-xl neumorphic-input text-slate-900 dark:text-slate-100"
                placeholder="Manas Shinde"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+91</span>
                <input
                  className="w-full pl-14 pr-5 py-4 rounded-xl neumorphic-input text-slate-900 dark:text-slate-100"
                  placeholder="98765 43210"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address *</label>
              <input
                className="w-full px-5 py-4 rounded-xl neumorphic-input text-slate-900 dark:text-slate-100"
                placeholder="user@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Create Password *</label>
              <div className="relative">
                <input
                  className="w-full px-5 py-4 rounded-xl neumorphic-input text-slate-900 dark:text-slate-100"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                >
                  <span className="text-xl">{showPassword ? '👁️' : '👁️‍🗨️'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 ml-1">Minimum 6 characters</p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                className="mt-1 rounded border-slate-300 text-primary focus:ring-primary h-5 w-5 neumorphic-input"
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed" htmlFor="terms">
                I agree to the{' '}
                <a className="text-primary font-bold underline" href="/terms">Terms of Service</a>{' '}
                and{' '}
                <a className="text-primary font-bold underline" href="/privacy">Privacy Policy</a>.
              </label>
            </div>

            {/* Submit & Login Link */}
            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm order-2 md:order-1">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold">Log in</Link>
              </p>
              <button
                className="w-full md:w-auto min-w-[200px] py-4 px-8 rounded-xl neumorphic-button-primary font-bold text-lg flex items-center justify-center gap-2 order-1 md:order-2 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account →
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-background-light shadow-neumorphic-flat flex items-center justify-center text-primary">
                <span className="text-xl">🔒</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Secure</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-background-light shadow-neumorphic-flat flex items-center justify-center text-primary">
                <span className="text-xl">🌿</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Eco-Friendly</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-background-light shadow-neumorphic-flat flex items-center justify-center text-primary">
                <span className="text-xl">🎨</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Infinite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
