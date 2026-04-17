import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">search_off</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
          >
            Go Back
          </button>
          <Link 
            to="/" 
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors text-center"
          >
            Home Page
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/paints" className="text-primary text-sm hover:underline">Paints</Link>
            <Link to="/hardware" className="text-primary text-sm hover:underline">Hardware</Link>
            <Link to="/visualizer" className="text-primary text-sm hover:underline">Colour Visualizer</Link>
            <Link to="/contact" className="text-primary text-sm hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
