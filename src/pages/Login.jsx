import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../api'
import OTPVerification from '../components/OTPVerification'
import toast from 'react-hot-toast'

const MayurLogo = () => (
  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" />
  </svg>
)

function Login({ onLogin }) {
  const [loginRole, setLoginRole] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await authAPI.login(email, password, loginRole)
      
      // Handle OTP flow (if server sends requiresOTP)
      if (result.success && result.requiresOTP) {
        toast.success('OTP sent to your email!')
        setOtpEmail(email)
        setShowOTP(true)
      } else if (result.success && result.data) {
        // Normal login success — extract from { success, data: { token, user, role } }
        const { token, user, role } = result.data
        
        // IMPORTANT: Use the role from server response, not loginRole
        const actualRole = role || user.role
        
        localStorage.setItem('mp_token', token)
        localStorage.setItem('mp_user', JSON.stringify(user))
        localStorage.setItem('mp_role', actualRole)
        
        // Check if user tried to login as admin but is not admin
        if (loginRole === 'admin' && actualRole !== 'admin') {
          setError('This account is not an admin account. Please login as a user.')
          toast.error('Not an admin account')
          setLoading(false)
          return
        }
        
        toast.success(`Welcome back, ${user?.name || 'User'}!`)
        
        // Pass the ACTUAL role from server, not what user clicked
        if (onLogin) onLogin(actualRole, user, token)
      } else {
        throw new Error(result.message || 'Login failed')
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Check your credentials.'
      
      // Provide helpful error messages
      if (errorMessage.includes('Invalid email')) {
        setError('No account found with this email. Please sign up first.')
        toast.error('Account not found. Please sign up.')
      } else if (errorMessage.includes('Invalid') && errorMessage.includes('password')) {
        setError('Incorrect password. Please try again.')
        toast.error('Incorrect password')
      } else if (errorMessage.includes('not registered as')) {
        setError(errorMessage)
        toast.error(errorMessage)
      } else {
        setError(errorMessage)
        toast.error(errorMessage)
      }
    }
    setLoading(false)
  }


  const handleOTPSuccess = (response) => {
    if (response.success && onLogin) {
      onLogin(loginRole, response.user, response.token)
    }
  }

  const handleBackFromOTP = () => {
    setShowOTP(false)
    setOtpEmail('')
  }

  if (showOTP) {
    return <OTPVerification email={otpEmail} onSuccess={handleOTPSuccess} onBack={handleBackFromOTP} />
  }

  return (
    <div className="bg-white dark:bg-slate-950 font-display min-h-screen flex items-center justify-center p-4">
      <div className="relative flex h-auto w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="layout-container flex h-full grow flex-col md:flex-row">

          {/* ── Left Side: Branding ── */}
          <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-primary/5 to-orange-50/50 dark:from-primary/10 dark:to-slate-900 border-r border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
              <div className="size-10 text-primary"><MayurLogo /></div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">Mayur Paints</h2>
            </div>
            <div className="space-y-6">
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                <img alt="Premium paint buckets" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">Welcome to Mayur Paints</h1>
                <p className="mt-3 text-slate-500 text-base">Sign in to access your dashboard, manage orders, and explore 400+ premium products.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-primary text-lg">🔒</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">OTP Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-primary text-lg">✓</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Secure Login</span>
              </div>
            </div>
          </div>

          {/* ── Right Side: Login Form ── */}
          <div className="flex flex-1 flex-col items-center justify-center p-8 md:p-16 bg-white dark:bg-slate-950">
            <div className="w-full max-w-[400px]">
              <header className="flex flex-col items-center mb-10 md:hidden">
                <div className="size-12 text-primary mb-4"><MayurLogo /></div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Mayur Paints</h2>
              </header>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign In</h1>
                <p className="text-slate-400 mt-2">Welcome back! Choose your role to continue.</p>
              </div>

              {/* Role Toggle */}
              <div className="flex p-1.5 mb-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setLoginRole('user')} className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${loginRole === 'user' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-700'}`}>
                  <span className="text-lg">👤</span> User
                </button>
                <button type="button" onClick={() => setLoginRole('admin')} className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${loginRole === 'admin' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>
                  <span className="text-lg">⚙️</span> Admin
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">Email</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">@</span>
                    <input className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:border-primary/50 focus:ring-0 transition-colors" placeholder={loginRole === 'admin' ? 'manashshinde@gmail.com' : 'your@email.com'} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔒</span>
                    <input className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:border-primary/50 focus:ring-0 transition-colors" placeholder="••••••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs px-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" /> Remember me
                  </label>
                  <a className="text-primary hover:underline font-medium" href="#">Forgot Password?</a>
                </div>
                <button className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-60" type="submit" disabled={loading}>
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Sign In as {loginRole === 'admin' ? 'Admin' : 'User'} →</>
                  )}
                </button>
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">New here?</span>
                    <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
                  </div>
                  <Link to="/signup" className="w-full py-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-lg flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all">
                    <span className="text-xl">✨</span> Create Account
                  </Link>
                </div>
              </form>
              <p className="mt-10 text-center text-xs text-slate-400">© 2026 Mayur Paints Limited. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
