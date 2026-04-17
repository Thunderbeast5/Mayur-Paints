import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

export default function PaintCalculator({ cartCount, userRole }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    doors: 1,
    windows: 2,
    largeWindows: 0,
    surfaceType: 'smooth',
    coats: 2,
    includeCeiling: false,
    roomType: 'living-room'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const surfaceTypes = [
    { value: 'smooth', label: 'Smooth Wall', coverage: '140 sq.ft/L' },
    { value: 'textured', label: 'Textured Wall', coverage: '90 sq.ft/L' },
    { value: 'concrete', label: 'Concrete', coverage: '70 sq.ft/L' },
    { value: 'wood', label: 'Wood', coverage: '80 sq.ft/L' }
  ]

  const roomTypes = [
    { value: 'living-room', label: 'Living Room', icon: 'living' },
    { value: 'bedroom', label: 'Bedroom', icon: 'bed' },
    { value: 'kitchen', label: 'Kitchen', icon: 'kitchen' },
    { value: 'bathroom', label: 'Bathroom', icon: 'bathroom' },
    { value: 'exterior', label: 'Exterior', icon: 'home' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCalculate = async () => {
    // Validate inputs
    if (!formData.length || !formData.width || !formData.height) {
      toast.error('Please enter all room dimensions')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/paint-calculator/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimensions: {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height)
          },
          openings: {
            doors: parseInt(formData.doors),
            windows: parseInt(formData.windows),
            largeWindows: parseInt(formData.largeWindows)
          },
          surfaceType: formData.surfaceType,
          coats: parseInt(formData.coats),
          includeCeiling: formData.includeCeiling
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
        setStep(3)
      } else {
        toast.error(data.message || 'Calculation failed')
      }
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Failed to calculate paint quantity')
    }

    setLoading(false)
  }

  const handleReset = () => {
    setFormData({
      length: '',
      width: '',
      height: '',
      doors: 1,
      windows: 2,
      largeWindows: 0,
      surfaceType: 'smooth',
      coats: 2,
      includeCeiling: false,
      roomType: 'living-room'
    })
    setResult(null)
    setStep(1)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar cartCount={cartCount} userRole={userRole} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4">
            🎨 Paint Calculator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Calculate exactly how much paint you need for your project
          </p>
        </div>

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

        {/* Step 1: Room Type & Dimensions */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-black mb-6">Step 1: Room Details</h2>

            {/* Room Type */}
            <div className="mb-8">
              <label className="block font-bold mb-4">Room Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {roomTypes.map((room) => (
                  <button
                    key={room.value}
                    onClick={() => setFormData(prev => ({ ...prev, roomType: room.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.roomType === room.value
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl mb-2 block">{room.icon}</span>
                    <div className="text-sm font-bold">{room.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="mb-8">
              <label className="block font-bold mb-4">Room Dimensions (in feet)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Length</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="e.g., 15"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Width</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="e.g., 12"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Height</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Openings */}
            <div className="mb-8">
              <label className="block font-bold mb-4">Doors & Windows</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Doors</label>
                  <input
                    type="number"
                    name="doors"
                    value={formData.doors}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Windows</label>
                  <input
                    type="number"
                    name="windows"
                    value={formData.windows}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Large Windows</label>
                  <input
                    type="number"
                    name="largeWindows"
                    value={formData.largeWindows}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-0"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.length || !formData.width || !formData.height}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Surface Details
            </button>
          </div>
        )}

        {/* Step 2: Surface Type & Coats */}
        {step === 2 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-black mb-6">Step 2: Surface & Coating</h2>

            {/* Surface Type */}
            <div className="mb-8">
              <label className="block font-bold mb-4">Surface Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {surfaceTypes.map((surface) => (
                  <button
                    key={surface.value}
                    onClick={() => setFormData(prev => ({ ...prev, surfaceType: surface.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.surfaceType === surface.value
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="font-bold mb-1">{surface.label}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Coverage: {surface.coverage}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Coats */}
            <div className="mb-8">
              <label className="block font-bold mb-4">Number of Coats</label>
              <div className="flex gap-4">
                {[1, 2, 3].map((coat) => (
                  <button
                    key={coat}
                    onClick={() => setFormData(prev => ({ ...prev, coats: coat }))}
                    className={`flex-1 py-4 rounded-xl border-2 font-bold transition-all ${
                      formData.coats === coat
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    {coat} {coat === 1 ? 'Coat' : 'Coats'}
                  </button>
                ))}
              </div>
            </div>

            {/* Include Ceiling */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="includeCeiling"
                  checked={formData.includeCeiling}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <span className="font-bold">Include ceiling in calculation</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold hover:border-primary transition-all"
              >
                Back
              </button>
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Calculate'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-6">
            {/* Area Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
              <h2 className="text-2xl font-black mb-6">📐 Area Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Wall Area</div>
                  <div className="text-2xl font-black text-primary">{result.areas.wallArea} sq.ft</div>
                </div>
                {result.areas.ceilingArea > 0 && (
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ceiling Area</div>
                    <div className="text-2xl font-black text-primary">{result.areas.ceilingArea} sq.ft</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Openings</div>
                  <div className="text-2xl font-black text-slate-600">{result.areas.openingsArea} sq.ft</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Net Paintable</div>
                  <div className="text-2xl font-black text-green-600">{result.areas.netArea} sq.ft</div>
                </div>
              </div>
            </div>

            {/* Paint Quantity */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20 p-8">
              <h2 className="text-2xl font-black mb-6">🎨 Paint Required</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Per Coat</div>
                  <div className="text-3xl font-black text-primary">{result.quantity.perCoat}L</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total ({result.coats} coats)</div>
                  <div className="text-3xl font-black text-primary">{result.quantity.total}L</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">To Purchase</div>
                  <div className="text-3xl font-black text-green-600">{result.quantity.toPurchase}L</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
                <h3 className="font-bold mb-4">Recommended Cans:</h3>
                <div className="space-y-3">
                  {result.recommendedCans.map((can, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">format_paint</span>
                        <span className="font-bold">{can.size} can</span>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-lg">×{can.quantity}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{can.totalLiters}L total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold hover:border-primary transition-all"
              >
                New Calculation
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">print</span>
                Print Results
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
