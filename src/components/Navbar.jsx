import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { useState } from 'react'

export default function Navbar({ cartCount, userRole }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const cart = useSelector(state => state.cart)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0)

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">format_paint</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black leading-none tracking-tight">
                Mayur <span className="text-primary">Paints</span>
              </h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Est. 1985</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/paints" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Paints
            </Link>
            <Link to="/hardware" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Hardware
            </Link>
            <Link to="/visualizer" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Visualizer
            </Link>
            <Link to="/services" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Services
            </Link>
            <Link to="/about" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/40 transition-all">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-[20px]">shopping_cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/40 transition-all"
                >
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-black text-primary">{user.name?.charAt(0) || 'U'}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.name?.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400/40 transition-all"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 hover:text-red-400 text-[20px]">logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">login</span>
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                Home
              </Link>
              <Link to="/paints" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                Paints
              </Link>
              <Link to="/hardware" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                Hardware
              </Link>
              <Link to="/visualizer" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                Visualizer
              </Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                Services
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                About
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    My Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors text-center">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
