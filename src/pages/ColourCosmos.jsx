import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../redux/cartSlice'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// ─── Helpers ────────────────────────────────────────────────────────────────
function shadeHex(hex, amt) {
  if (!hex || !hex.startsWith('#')) return '#E4DDD5'
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amt))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amt))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amt))
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function applyBrightSat(hex, brightness, saturation) {
  if (!hex) return null
  try {
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)
    r = Math.min(255, Math.round(r * brightness))
    g = Math.min(255, Math.round(g * brightness))
    b = Math.min(255, Math.round(b * brightness))
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    r = Math.min(255, Math.round(gray + saturation * (r - gray)))
    g = Math.min(255, Math.round(gray + saturation * (g - gray)))
    b = Math.min(255, Math.round(gray + saturation * (b - gray)))
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
  } catch { return hex }
}

// ─── Colour Palette ──────────────────────────────────────────────────────────
const PALETTE = [
  { name: 'Pearl White',      color: '#FEFEFE', code: 'CC-001', family: 'Neutrals' },
  { name: 'Cloud White',      color: '#F0F4F8', code: 'CC-002', family: 'Neutrals', popular: true },
  { name: 'Warm Sand',        color: '#D4A96A', code: 'CC-003', family: 'Neutrals' },
  { name: 'Desert Sand',      color: '#C2A882', code: 'CC-004', family: 'Neutrals' },
  { name: 'Cream',            color: '#FFFDD0', code: 'CC-005', family: 'Neutrals' },
  { name: 'Ivory',            color: '#FFFFF0', code: 'CC-006', family: 'Neutrals' },
  { name: 'Champagne',        color: '#F7E7CE', code: 'CC-007', family: 'Neutrals' },
  { name: 'Silver Grey',      color: '#B0B0B0', code: 'CC-008', family: 'Neutrals' },
  { name: 'Charcoal',         color: '#36454F', code: 'CC-009', family: 'Neutrals' },
  { name: 'Graphite',         color: '#4A4A4A', code: 'CC-010', family: 'Neutrals' },
  { name: 'Slate Grey',       color: '#708090', code: 'CC-011', family: 'Neutrals' },
  { name: 'Concrete',         color: '#95A5A6', code: 'CC-012', family: 'Neutrals' },
  { name: 'Terracotta',       color: '#C14545', code: 'CC-013', family: 'Warm', popular: true },
  { name: 'Terracotta Orange',color: '#EC5B13', code: 'CC-014', family: 'Warm', popular: true },
  { name: 'Brick Red',        color: '#CB4154', code: 'CC-015', family: 'Warm' },
  { name: 'Rust',             color: '#B7410E', code: 'CC-016', family: 'Warm' },
  { name: 'Burgundy',         color: '#800020', code: 'CC-017', family: 'Warm' },
  { name: 'Coral Reef',       color: '#FF6B6B', code: 'CC-019', family: 'Warm' },
  { name: 'Peach',            color: '#FFDAB9', code: 'CC-020', family: 'Warm' },
  { name: 'Blush Pink',       color: '#FFB6C1', code: 'CC-021', family: 'Warm', popular: true },
  { name: 'Dusty Rose',       color: '#DCAE96', code: 'CC-022', family: 'Warm' },
  { name: 'Mauve',            color: '#D8A0D0', code: 'CC-023', family: 'Warm' },
  { name: 'Amber',            color: '#FFBF00', code: 'CC-024', family: 'Warm' },
  { name: 'Mustard',          color: '#FFDB58', code: 'CC-025', family: 'Warm' },
  { name: 'Sunshine Yellow',  color: '#F1C40F', code: 'CC-027', family: 'Warm' },
  { name: 'Sage Green',       color: '#87AE73', code: 'CC-029', family: 'Cool', popular: true },
  { name: 'Sage Garden',      color: '#D9E4DD', code: 'CC-030', family: 'Cool' },
  { name: 'Mint Cream',       color: '#AEDFC8', code: 'CC-031', family: 'Cool' },
  { name: 'Forest Green',     color: '#228B22', code: 'CC-032', family: 'Cool' },
  { name: 'Moss Green',       color: '#8A9A5B', code: 'CC-033', family: 'Cool' },
  { name: 'Emerald',          color: '#50C878', code: 'CC-034', family: 'Cool' },
  { name: 'Olive',            color: '#808000', code: 'CC-035', family: 'Cool' },
  { name: 'Teal',             color: '#008080', code: 'CC-036', family: 'Cool', popular: true },
  { name: 'Turquoise',        color: '#40E0D0', code: 'CC-038', family: 'Cool' },
  { name: 'Ocean Mist',       color: '#B0D8E3', code: 'CC-039', family: 'Cool' },
  { name: 'Sky Blue',         color: '#87CEEB', code: 'CC-040', family: 'Cool' },
  { name: 'Aegean Blue',      color: '#3498DB', code: 'CC-041', family: 'Cool', popular: true },
  { name: 'Cobalt',           color: '#0047AB', code: 'CC-042', family: 'Cool' },
  { name: 'Navy Blue',        color: '#1B2A4A', code: 'CC-043', family: 'Cool' },
  { name: 'Powder Blue',      color: '#B0E0E6', code: 'CC-045', family: 'Cool' },
  { name: 'Lavender',         color: '#D4B8E0', code: 'CC-046', family: 'Bold', popular: true },
  { name: 'Lilac',            color: '#C8A2C8', code: 'CC-047', family: 'Bold' },
  { name: 'Plum',             color: '#8E4585', code: 'CC-048', family: 'Bold' },
  { name: 'Indigo',           color: '#4B0082', code: 'CC-049', family: 'Bold' },
  { name: 'Khaki',            color: '#C3B091', code: 'CC-050', family: 'Bold' },
]

const FAMILIES = ['All', 'Neutrals', 'Warm', 'Cool', 'Bold']

const FINISHES = [
  { id: 'matte',     label: 'Matte',     description: 'Non-reflective, velvety smooth',      gloss: 0 },
  { id: 'eggshell',  label: 'Eggshell',  description: 'Very low sheen, easy to clean',       gloss: 0.12 },
  { id: 'satin',     label: 'Satin',     description: 'Silky sheen, washable surface',       gloss: 0.28 },
  { id: 'gloss',     label: 'Gloss',     description: 'High shine, maximum durability',      gloss: 0.55 },
]

const ROOMS = [
  { id: 'living',   name: 'Living Room', icon: '🛋️' },
  { id: 'bedroom',  name: 'Bedroom',     icon: '🛏️' },
  { id: 'kitchen',  name: 'Kitchen',     icon: '🍳' },
  { id: 'office',   name: 'Study / Office', icon: '📚' },
]

// ─── SVG Room Scenes with Photorealistic 3D Walls ───────────────────────────
// RULE: Walls use multi-stop gradients for photorealistic lighting
//       Everything else (floor, ceiling, furniture) has FIXED fills

function RoomScene({ roomId, wallColor, finish }) {
  const DEFAULT = '#E4DDD5'
  const wall = wallColor || DEFAULT
  const gloss = finish?.gloss || 0
  const id = roomId

  // ── Living Room ──────────────────────────────────────────────────────────
  if (id === 'living') return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Photorealistic vertical gradient for back wall */}
        <linearGradient id={`wall-v-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={shadeHex(wall, 40)}  stopOpacity="1" />
          <stop offset="35%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="85%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={shadeHex(wall, -25)} stopOpacity="1" />
        </linearGradient>
        
        {/* Left side wall - perspective darkening */}
        <linearGradient id={`wall-l-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={shadeHex(wall, -45)} stopOpacity="1" />
          <stop offset="30%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={wall}                stopOpacity="1" />
        </linearGradient>
        
        {/* Right side wall - perspective darkening */}
        <linearGradient id={`wall-r-${id}`} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor={shadeHex(wall, -45)} stopOpacity="1" />
          <stop offset="30%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={wall}                stopOpacity="1" />
        </linearGradient>
        
        {/* Ceiling light glow */}
        <radialGradient id={`wall-glow-${id}`} cx="50%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.10 + gloss * 0.05} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        
        {/* Window light beam */}
        <linearGradient id={`wl-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8E8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── WALLS (photorealistic 3D rendering) ── */}
      {/* Left side wall - base gradient */}
      <polygon points="0,0 165,88 165,415 0,500" fill={`url(#wall-l-${id})`} />
      
      {/* Right side wall - base gradient */}
      <polygon points="800,0 635,88 635,415 800,500" fill={`url(#wall-r-${id})`} />
      
      {/* Back wall - base vertical gradient */}
      <polygon points="165,88 635,88 635,415 165,415" fill={`url(#wall-v-${id})`} />
      
      {/* Back wall - ceiling light glow overlay */}
      <polygon points="165,88 635,88 635,415 165,415" fill={`url(#wall-glow-${id})`} />
      
      {/* Corner shadow strips */}
      <line x1="165" y1="88" x2="165" y2="415" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
      <line x1="635" y1="88" x2="635" y2="415" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
      
      {/* Floor-wall ambient occlusion strip */}
      <polygon points="165,395 635,395 635,415 165,415" fill="rgba(0,0,0,0.18)" />


      {/* ── FIXED SURFACES (never change color) ── */}
      {/* Ceiling */}
      <polygon points="0,0 800,0 635,88 165,88" fill="#F2EDE7" />
      {/* Floor — parquet wood */}
      <polygon points="0,500 800,500 635,415 165,415" fill="#A07848" />
      <polygon points="0,500 800,500 635,415 165,415" fill="url(#wl-living)" opacity="0.2" />
      {/* Floor planks */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={165 + i*120} y1={415} x2={0 + i*200} y2={500}
          stroke="#8B6238" strokeWidth="1.2" opacity="0.5" />
      ))}

      {/* ── WINDOW ── */}
      <rect x="268" y="110" width="138" height="170" rx="3" fill="#C8E0F0" opacity="0.88" />
      {/* window frame */}
      <rect x="265" y="107" width="144" height="176" rx="4" fill="none" stroke="#7A5C3A" strokeWidth="5" />
      <line x1="337" y1="107" x2="337" y2="283" stroke="#7A5C3A" strokeWidth="3" />
      <line x1="265" y1="193" x2="409" y2="193" stroke="#7A5C3A" strokeWidth="3" />
      {/* sky through window */}
      <rect x="268" y="110" width="68" height="82" fill="#E8F4FF" opacity="0.6" />
      {/* window light on floor */}
      <polygon points="268,283 406,283 560,415 180,415" fill="#FFF8E8" opacity="0.12" />

      {/* ── PICTURE FRAME ── */}
      <rect x="435" y="115" width="110" height="80" rx="3" fill="#6B5235" />
      <rect x="440" y="120" width="100" height="70" fill="#8BA888" />
      <rect x="455" y="132" width="70" height="46" fill="#6B8870" opacity="0.8" />
      <rect x="463" y="138" width="30" height="20" fill="#5A7A60" opacity="0.9" />

      {/* ── SOFA ── */}
      {/* sofa body */}
      <rect x="210" y="340" width="380" height="65" rx="10" fill="#5C4B3E" />
      {/* back cushions */}
      <rect x="215" y="308" width="115" height="42" rx="8" fill="#6E5C50" />
      <rect x="335" y="308" width="115" height="42" rx="8" fill="#6E5C50" />
      <rect x="455" y="308" width="115" height="42" rx="8" fill="#6E5C50" />
      {/* armrests */}
      <rect x="210" y="315" width="28" height="90" rx="8" fill="#503E34" />
      <rect x="562" y="315" width="28" height="90" rx="8" fill="#503E34" />
      {/* seat cushions */}
      <rect x="240" y="342" width="108" height="30" rx="5" fill="#7A6458" />
      <rect x="352" y="342" width="108" height="30" rx="5" fill="#7A6458" />
      <rect x="464" y="342" width="96"  height="30" rx="5" fill="#7A6458" />
      {/* scatter cushions */}
      <rect x="280" y="315" width="62" height="38" rx="7" fill="#8B7BAA" />
      <rect x="455" y="315" width="62" height="38" rx="7" fill="#7A9BAB" />

      {/* ── COFFEE TABLE ── */}
      <rect x="288" y="412" width="225" height="12" rx="5" fill="#4A3020" />
      <rect x="300" y="424" width="10" height="22" fill="#4A3020" />
      <rect x="488" y="424" width="10" height="22" fill="#4A3020" />
      {/* table top item */}
      <ellipse cx="400" cy="413" rx="25" ry="5" fill="#CC8844" opacity="0.5" />

      {/* ── FLOOR LAMP ── */}
      <rect x="607" y="290" width="6" height="125" fill="#9A8070" />
      <ellipse cx="610" cy="415" rx="14" ry="5" fill="#7A6050" />
      <polygon points="595,290 625,290 618,268 602,268" fill="#F0D880" opacity="0.9" />
      <ellipse cx="610" cy="268" rx="9" ry="3" fill="#D8C060" />

      {/* ── RUG ── */}
      <ellipse cx="400" cy="435" rx="170" ry="22" fill="#8B6A4E" opacity="0.35" />


      {/* ── PLANT ── */}
      <rect x="152" y="370" width="18" height="38" rx="2" fill="#7A5C2A" />
      <ellipse cx="161" cy="362" rx="30" ry="36" fill="#2D6A4F" />
      <ellipse cx="148" cy="348" rx="20" ry="26" fill="#3A8060" />
      <ellipse cx="174" cy="354" rx="20" ry="23" fill="#4A9870" />
    </svg>
  )

  // ── Bedroom ──────────────────────────────────────────────────────────────
  if (id === 'bedroom') return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Photorealistic vertical gradient for back wall */}
        <linearGradient id={`wall-v-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={shadeHex(wall, 40)}  stopOpacity="1" />
          <stop offset="35%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="85%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={shadeHex(wall, -25)} stopOpacity="1" />
        </linearGradient>
        
        {/* Left side wall */}
        <linearGradient id={`wall-l-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={shadeHex(wall, -45)} stopOpacity="1" />
          <stop offset="30%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={wall}                stopOpacity="1" />
        </linearGradient>
        
        {/* Right side wall */}
        <linearGradient id={`wall-r-${id}`} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor={shadeHex(wall, -45)} stopOpacity="1" />
          <stop offset="30%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={wall}                stopOpacity="1" />
        </linearGradient>
        
        {/* Ceiling light glow */}
        <radialGradient id={`wall-glow-${id}`} cx="50%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.10 + gloss * 0.05} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── WALLS (photorealistic 3D) ── */}
      <polygon points="0,0 150,78 150,430 0,500" fill={`url(#wall-l-${id})`} />
      <polygon points="800,0 650,78 650,430 800,500" fill={`url(#wall-r-${id})`} />
      <polygon points="150,78 650,78 650,430 150,430" fill={`url(#wall-v-${id})`} />
      <polygon points="150,78 650,78 650,430 150,430" fill={`url(#wall-glow-${id})`} />
      
      {/* Corner shadows */}
      <line x1="150" y1="78" x2="150" y2="430" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
      <line x1="650" y1="78" x2="650" y2="430" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
      
      {/* Floor-wall AO */}
      <polygon points="150,410 650,410 650,430 150,430" fill="rgba(0,0,0,0.18)" />

      {/* ── FIXED SURFACES ── */}
      <polygon points="0,0 800,0 650,78 150,78" fill="#F0EBE5" />
      {/* Floor carpet */}
      <polygon points="0,500 800,500 650,430 150,430" fill="#9F8B76" />

      {/* ── CURTAINS + WINDOW ── */}
      <rect x="150" y="78" width="35" height="200" fill="#9B8B9B" opacity="0.75" />
      <rect x="615" y="78" width="35" height="200" fill="#9B8B9B" opacity="0.75" />
      <rect x="185" y="88" width="105" height="155" rx="2" fill="#C5DDEF" opacity="0.8" />
      <line x1="237" y1="88" x2="237" y2="243" stroke="#7A5C3A" strokeWidth="2.5" />
      <line x1="185" y1="165" x2="290" y2="165" stroke="#7A5C3A" strokeWidth="2.5" />
      <rect x="188" y="91"  width="46" height="73" fill="white" opacity="0.15" />

      {/* ── WALL ART ── */}
      <rect x="342" y="95" width="116" height="85" rx="4" fill="#6B5235" />
      <rect x="347" y="100" width="106" height="75" fill="#D4C5B8" />
      <ellipse cx="400" cy="137" rx="30" ry="20" fill="#9BAACC" opacity="0.8" />
      <ellipse cx="388" cy="133" rx="14" ry="10" fill="#BBC4DC" opacity="0.7" />

      {/* ── BED HEADBOARD ── */}
      <rect x="240" y="250" width="320" height="90" rx="12" fill="#5A3E30" />
      <rect x="248" y="256" width="304" height="76" rx="10" fill="#6B4E3C" />
      {/* center tufting detail */}
      {[280,320,360,400,440,480].map(x => (
        <circle key={x} cx={x} cy={295} r="4" fill="#4A3020" opacity="0.5" />
      ))}
      {/* bed base */}
      <rect x="225" y="332" width="350" height="88" rx="6" fill="#7A6350" />
      {/* mattress */}
      <rect x="235" y="318" width="330" height="26" rx="5" fill="#F0ECE7" />
      {/* duvet */}
      <rect x="235" y="340" width="330" height="78" rx="5" fill="#E8D8C8" />
      {[0,1,2,3].map(i => (
        <line key={i} x1={248} y1={356 + i*14} x2={552} y2={356 + i*14}
          stroke="#D4BEA8" strokeWidth="2" opacity="0.7" />
      ))}
      {/* pillows */}
      <rect x="248" y="290" width="115" height="34" rx="8" fill="#FFFFFF" />
      <rect x="437" y="290" width="115" height="34" rx="8" fill="#F0E6FF" />

      {/* ── BEDSIDE TABLES ── */}
      <rect x="148" y="320" width="76" height="100" rx="5" fill="#4A3020" />
      <rect x="153" y="330" width="66" height="38" rx="3" fill="#5A3E28" />
      <rect x="576" y="320" width="76" height="100" rx="5" fill="#4A3020" />
      <rect x="581" y="330" width="66" height="38" rx="3" fill="#5A3E28" />
      {/* drawer handle */}
      <rect x="180" y="348" rx="2" width="20" height="4" fill="#8B7040" />
      <rect x="608" y="348" rx="2" width="20" height="4" fill="#8B7040" />

      {/* ── LAMPS ── */}
      <rect x="182" y="280" width="8" height="42" fill="#9A8060" />
      <polygon points="170,280 202,280 196,260 176,260" fill="#F5E880" opacity="0.92" />
      <ellipse cx="186" cy="260" rx="11" ry="4" fill="#E0C060" />
      <rect x="608" y="280" width="8" height="42" fill="#9A8060" />
      <polygon points="596,280 628,280 622,260 602,260" fill="#F5E880" opacity="0.92" />
      <ellipse cx="612" cy="260" rx="11" ry="4" fill="#E0C060" />
    </svg>
  )

  // ── Kitchen ──────────────────────────────────────────────────────────────
  if (id === 'kitchen') return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Photorealistic wall gradients */}
        <linearGradient id={`wall-v-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={shadeHex(wall, 40)}  stopOpacity="1" />
          <stop offset="35%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="85%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={shadeHex(wall, -25)} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`wall-l-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={shadeHex(wall, -45)} stopOpacity="1" />
          <stop offset="30%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={wall}                stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`wall-r-${id}`} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor={shadeHex(wall, -45)} stopOpacity="1" />
          <stop offset="30%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={wall}                stopOpacity="1" />
        </linearGradient>
        <radialGradient id={`wall-glow-${id}`} cx="50%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.10 + gloss * 0.05} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── WALLS (photorealistic) ── */}
      <polygon points="0,0 138,70 138,435 0,500" fill={`url(#wall-l-${id})`} />
      <polygon points="800,0 662,70 662,435 800,500" fill={`url(#wall-r-${id})`} />
      <polygon points="138,70 662,70 662,435 138,435" fill={`url(#wall-v-${id})`} />
      <polygon points="138,70 662,70 662,435 138,435" fill={`url(#wall-glow-${id})`} />
      <line x1="138" y1="70" x2="138" y2="435" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
      <line x1="662" y1="70" x2="662" y2="435" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
      <polygon points="138,415 662,415 662,435 138,435" fill="rgba(0,0,0,0.18)" />

      {/* ── FIXED ── */}
      <polygon points="0,0 800,0 662,70 138,70" fill="#F0ECE6" />
      {/* dark tile floor */}
      <polygon points="0,500 800,500 662,435 138,435" fill="#686460" />
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={138+i*106} y1={435} x2={0+i*160} y2={500}
          stroke="#554E4A" strokeWidth="1" opacity="0.6" />
      ))}

      {/* ── UPPER CABINETS ── */}
      <rect x="140" y="84" width="194" height="112" rx="3" fill="#DDD8D0" />
      <rect x="143" y="87" width="93" height="106" rx="2" fill="#D0CBC2" />
      <rect x="238" y="87" width="93" height="106" rx="2" fill="#D0CBC2" />
      <circle cx="188" cy="140" r="5" fill="#A09080" />
      <circle cx="284" cy="140" r="5" fill="#A09080" />
      {/* right upper cabinets */}
      <rect x="466" y="84" width="194" height="112" rx="3" fill="#DDD8D0" />
      <rect x="469" y="87" width="93" height="106" rx="2" fill="#D0CBC2" />
      <rect x="564" y="87" width="93" height="106" rx="2" fill="#D0CBC2" />
      <circle cx="514" cy="140" r="5" fill="#A09080" />
      <circle cx="610" cy="140" r="5" fill="#A09080" />

      {/* ── RANGE HOOD ── */}
      <polygon points="310,70 490,70 472,96 328,96" fill="#A09888" />
      <rect x="328" y="96" width="144" height="9" fill="#8E8070" />

      {/* ── BACKSPLASH TILES (wall-coloured tint) ── */}
      {[0,1,2,3,4,5,6].map(col =>
        [0,1,2,3].map(row => (
          <rect key={`${col}-${row}`}
            x={141 + col * 38} y={205 + row * 25}
            width={36} height={23}
            fill={shadeHex(wall, 15)}
            stroke={shadeHex(wall, -20)}
            strokeWidth="1.5" opacity="0.6"
          />
        ))
      )}
      {/* right backsplash */}
      {[0,1,2,3,4].map(col =>
        [0,1,2,3].map(row => (
          <rect key={`r-${col}-${row}`}
            x={470 + col * 38} y={205 + row * 25}
            width={36} height={23}
            fill={shadeHex(wall, 15)}
            stroke={shadeHex(wall, -20)}
            strokeWidth="1.5" opacity="0.6"
          />
        ))
      )}

      {/* ── COUNTERTOP ── */}
      <rect x="138" y="306" width="524" height="22" rx="3" fill="#C8C4BC" />
      <rect x="138" y="326" width="524" height="4"  fill="#B0ACA4" />

      {/* ── LOWER CABINETS ── */}
      <rect x="138" y="330" width="170" height="105" rx="3" fill="#CEC9C0" />
      <rect x="141" y="333" width="164" height="99"  rx="2" fill="#C2BDB4" />
      <circle cx="222" cy="382" r="5" fill="#A09080" />
      <rect x="466" y="330" width="196" height="105" rx="3" fill="#CEC9C0" />
      <rect x="469" y="333" width="190" height="99"  rx="2" fill="#C2BDB4" />
      <circle cx="562" cy="382" r="5" fill="#A09080" />

      {/* ── STOVE ── */}
      <rect x="310" y="300" width="180" height="108" rx="4" fill="#3C3838" />
      <rect x="316" y="305" width="168" height="82"  rx="3" fill="#484444" />
      {[350, 440].map(cx => [
        <circle key={`o-${cx}`} cx={cx} cy={345} r={26} fill="#505050" />,
        <circle key={`i-${cx}`} cx={cx} cy={345} r={18} fill="#5E5E5E" />,
        <circle key={`c-${cx}`} cx={cx} cy={345} r={8}  fill="#6A6A6A" stroke="#888" strokeWidth="2" />,
      ])}

      {/* ── SINK ── */}
      <rect x="504" y="248" width="154" height="58" rx="4" fill="#B8B8C0" />
      <rect x="510" y="254" width="142" height="44" rx="3" fill="#A0A0A8" />
      <rect x="576" y="240" width="10" height="15" fill="#B8B8C0" />
      <ellipse cx="581" cy="240" rx="8" ry="5" fill="#A0A0A8" />

      {/* ── OVERHEAD LIGHT ── */}
      <rect x="390" y="70" width="20" height="8" fill="#DDD8D0" />
      <rect x="386" y="78" width="28" height="5" rx="2" fill="#FFE88A" opacity="0.9" />
    </svg>
  )

  // ── Study / Office ───────────────────────────────────────────────────────
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Photorealistic wall gradients */}
        <linearGradient id={`wall-v-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={shadeHex(wall, 40)}  stopOpacity="1" />
          <stop offset="35%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="85%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={shadeHex(wall, -25)} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`wall-l-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={shadeHex(wall, -45)} stopOpacity="1" />
          <stop offset="30%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={wall}                stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`wall-r-${id}`} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor={shadeHex(wall, -45)} stopOpacity="1" />
          <stop offset="30%"  stopColor={wall}                stopOpacity="1" />
          <stop offset="100%" stopColor={wall}                stopOpacity="1" />
        </linearGradient>
        <radialGradient id={`wall-glow-${id}`} cx="50%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.10 + gloss * 0.05} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── WALLS (photorealistic) ── */}
      <polygon points="0,0 155,82 155,428 0,500" fill={`url(#wall-l-${id})`} />
      <polygon points="800,0 645,82 645,428 800,500" fill={`url(#wall-r-${id})`} />
      <polygon points="155,82 645,82 645,428 155,428" fill={`url(#wall-v-${id})`} />
      <polygon points="155,82 645,82 645,428 155,428" fill={`url(#wall-glow-${id})`} />
      <line x1="155" y1="82" x2="155" y2="428" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
      <line x1="645" y1="82" x2="645" y2="428" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
      <polygon points="155,408 645,408 645,428 155,428" fill="rgba(0,0,0,0.18)" />

      {/* ── FIXED ── */}
      <polygon points="0,0 800,0 645,82 155,82" fill="#F0EBE4" />
      {/* parquet floor */}
      <polygon points="0,500 800,500 645,428 155,428" fill="#8C6840" />
      {[0,1,2,3].map(i => (
        <line key={i} x1={155+i*123} y1={428} x2={0+i*200} y2={500}
          stroke="#6B4E28" strokeWidth="1.2" opacity="0.5" />
      ))}

      {/* ── WINDOW ── */}
      <rect x="172" y="100" width="120" height="165" rx="3" fill="#C8E0F0" opacity="0.85" />
      <rect x="168" y="96"  width="128" height="173" rx="4" fill="none" stroke="#7A5C3A" strokeWidth="5" />
      <line x1="232" y1="96"  x2="232" y2="269" stroke="#7A5C3A" strokeWidth="3" />
      <line x1="168" y1="180" x2="296" y2="180" stroke="#7A5C3A" strokeWidth="3" />
      {/* curtain */}
      <rect x="155" y="82" width="25" height="190" fill="#8A7898" opacity="0.7" />
      {/* window light spill */}
      <polygon points="172,269 292,269 420,428 120,428" fill="#FFF8E0" opacity="0.1" />

      {/* ── BOOKSHELF ── */}
      <rect x="490" y="88" width="150" height="340" rx="3" fill="#4A3520" />
      {/* shelves */}
      {[148, 210, 272, 334].map(y => (
        <rect key={y} x="496" y={y} width="138" height="5" fill="#5C4428" />
      ))}
      {/* books */}
      <rect x="498" y="90"  width="12" height="55" fill="#8B3A3A" />
      <rect x="511" y="95"  width="10" height="50" fill="#3A6B8B" />
      <rect x="522" y="92"  width="14" height="53" fill="#6B8B3A" />
      <rect x="537" y="90"  width="11" height="55" fill="#8B6B3A" />
      <rect x="549" y="93"  width="12" height="52" fill="#6B3A8B" />
      <rect x="562" y="90"  width="10" height="55" fill="#3A8B6B" />
      <rect x="498" y="155" width="12" height="50" fill="#BB5555" />
      <rect x="511" y="158" width="10" height="47" fill="#5577BB" />
      <rect x="522" y="155" width="14" height="50" fill="#55AA77" />
      <rect x="537" y="155" width="11" height="50" fill="#AA7755" />
      <rect x="549" y="158" width="12" height="47" fill="#9955BB" />
      {/* small plant on shelf */}
      <rect x="600" y="196" width="14" height="18" rx="2" fill="#7A5C2A" />
      <ellipse cx="607" cy="195" rx="18" ry="22" fill="#2D6A4F" />

      {/* ── DESK ── */}
      <rect x="160" y="348" width="310" height="16" rx="4" fill="#5C3F20" />
      {/* desk legs */}
      <rect x="170" y="364" width="12" height="64" fill="#4A3018" />
      <rect x="456" y="364" width="12" height="64" fill="#4A3018" />
      {/* under-desk drawer unit */}
      <rect x="340" y="364" width="100" height="60" rx="3" fill="#5A3E24" />
      <rect x="343" y="367" width="94" height="25" rx="2" fill="#664820" />
      <rect x="343" y="395" width="94" height="25" rx="2" fill="#664820" />
      <circle cx="390" cy="380" r="4" fill="#A08060" />
      <circle cx="390" cy="407" r="4" fill="#A08060" />

      {/* ── CHAIR ── */}
      <ellipse cx="290" cy="428" rx="62" ry="18" fill="#2C2C2C" opacity="0.4" />
      {/* chair base + pole */}
      <rect x="284" y="408" width="12" height="28" fill="#555" />
      <ellipse cx="290" cy="436" rx="30" ry="8" fill="#444" />
      {/* seat */}
      <ellipse cx="290" cy="408" rx="55" ry="22" fill="#222" />
      <ellipse cx="290" cy="406" rx="50" ry="19" fill="#333" />
      {/* back rest */}
      <rect x="250" y="338" width="80" height="72" rx="8" fill="#282828" />
      <rect x="254" y="342" width="72" height="64" rx="6" fill="#323232" />

      {/* ── MONITOR ── */}
      <rect x="300" y="296" width="130" height="86" rx="5" fill="#1C1C1C" />
      <rect x="304" y="300" width="122" height="78" fill="#242830" />
      <rect x="304" y="300" width="122" height="78" fill="#3355AA" opacity="0.25" />
      {/* screen glow */}
      <rect x="304" y="300" width="122" height="78" fill="white" opacity="0.05" />
      {/* monitor stand */}
      <rect x="358" y="382" width="14" height="18" fill="#252525" />
      <rect x="344" y="395" width="42" height="5" rx="2" fill="#1C1C1C" />

      {/* ── DESK ACCESSORIES ── */}
      {/* mug */}
      <rect x="200" y="332" width="22" height="26" rx="3" fill="#E8E8E8" />
      <path d="M222,338 Q234,342 222,352" stroke="#CCC" strokeWidth="3" fill="none" />
      <rect x="204" y="334" width="14" height="4" fill="#DDD" opacity="0.6" />
      {/* notebook */}
      <rect x="232" y="335" width="50" height="30" rx="2" fill="#F5F0E8" />
      <line x1="237" y1="342" x2="276" y2="342" stroke="#CCC" strokeWidth="1" />
      <line x1="237" y1="349" x2="276" y2="349" stroke="#CCC" strokeWidth="1" />
      <line x1="237" y1="356" x2="262" y2="356" stroke="#CCC" strokeWidth="1" />
      {/* pen */}
      <line x1="225" y1="335" x2="232" y2="358" stroke="#444" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ColourCosmos() {
  const dispatch = useDispatch()
  const { totalCount: cartCount } = useSelector(s => s.cart)

  const [selectedRoom,   setSelectedRoom]   = useState('living')
  const [selectedColor,  setSelectedColor]  = useState(null)
  const [selectedFinish, setSelectedFinish] = useState('matte')
  const [brightness,     setBrightness]     = useState(1.0)
  const [saturation,     setSaturation]     = useState(1.0)
  const [searchQuery,    setSearchQuery]     = useState('')
  const [activeFamily,   setActiveFamily]   = useState('All')
  const [showSuccess,    setShowSuccess]    = useState(false)

  const currentFinish = FINISHES.find(f => f.id === selectedFinish)

  const displayColor = useCallback(() => {
    if (!selectedColor) return null
    return applyBrightSat(selectedColor, brightness, saturation)
  }, [selectedColor, brightness, saturation])

  const finalColor = displayColor()

  const filteredPalette = PALETTE.filter(s => {
    const okFamily = activeFamily === 'All' || s.family === activeFamily
    const okSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
    return okFamily && okSearch
  })

  const selectedShade = PALETTE.find(s => s.color === selectedColor)

  const handleAddToCart = () => {
    if (!selectedShade) { toast.error('Please select a color first!'); return }
    dispatch(addItem({
      id: `cosmos-${selectedShade.code}`,
      name: `${selectedShade.name} ${currentFinish?.label} Emulsion`,
      type: 'paint', category: 'Interior',
      price: 2100, code: selectedShade.code, size: '12L',
      shade: selectedShade.name, color: finalColor || selectedColor,
      finish: selectedFinish,
    }))
    toast.success(`${selectedShade.name} added to cart!`)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const panelBg   = 'rgba(20,28,44,0.92)'
  const border    = 'rgba(255,255,255,0.08)'
  const accent    = '#EC5B13'

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#0A1020 0%,#141E34 60%,#0A1020 100%)' }}>

      {/* ── HEADER ── */}
      <motion.header initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="sticky top-0 z-50 border-b"
        style={{ background:'rgba(10,16,32,0.95)', backdropFilter:'blur(20px)', borderColor: border }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `linear-gradient(135deg,${accent},#E67E22)` }}>🎨</div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight">Colour Cosmos</h2>
                <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: accent }}>Live Wall Visualizer</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/cart" className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors border"
                style={{ borderColor: border }}>
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ background: accent }}>{cartCount}</span>
                )}
              </Link>
              <Link to="/paints" className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: `linear-gradient(135deg,${accent},#E67E22)` }}>
                Shop Paints
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-5 items-start" style={{ minHeight: 'calc(100vh - 100px)' }}>

          {/* ════════════════════════════════════════════════════
              LEFT PANEL — Controls
          ════════════════════════════════════════════════════ */}
          <motion.div initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.05 }}
            className="flex-shrink-0 space-y-4 overflow-y-auto" style={{ width: 280, maxHeight:'calc(100vh - 112px)', scrollbarWidth:'thin' }}>

            {/* Room Selector */}
            <div className="rounded-2xl p-4 border" style={{ background: panelBg, borderColor: border }}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">Select Room</h3>
              <div className="grid grid-cols-2 gap-2">
                {ROOMS.map(room => (
                  <motion.button key={room.id} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                    onClick={() => setSelectedRoom(room.id)}
                    className="p-3 rounded-xl border-2 text-left transition-all"
                    style={{
                      background: selectedRoom === room.id ? `rgba(236,91,19,0.15)` : 'rgba(255,255,255,0.03)',
                      borderColor: selectedRoom === room.id ? accent : border,
                    }}>
                    <span className="text-xl block mb-0.5">{room.icon}</span>
                    <span className="text-xs font-bold text-white/80 leading-tight">{room.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Colour Picker */}
            <div className="rounded-2xl p-4 border" style={{ background: panelBg, borderColor: border }}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">Choose Colour</h3>

              {/* Family tabs */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {FAMILIES.map(fam => (
                  <button key={fam} onClick={() => setActiveFamily(fam)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                    style={{
                      background: activeFamily === fam ? accent : 'rgba(255,255,255,0.06)',
                      color: activeFamily === fam ? '#fff' : 'rgba(255,255,255,0.45)',
                    }}>{fam}</button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs">🔍</span>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search colours…"
                  className="w-full pl-7 pr-3 py-2 rounded-xl text-xs text-white placeholder-white/25 border focus:outline-none"
                  style={{ background:'rgba(255,255,255,0.05)', borderColor: border }}
                />
              </div>

              {/* Colour grid */}
              <div className="grid grid-cols-8 gap-1.5 max-h-44 overflow-y-auto pr-0.5" style={{ scrollbarWidth:'thin' }}>
                {filteredPalette.map(shade => (
                  <motion.button key={shade.code} whileHover={{ scale:1.18 }} whileTap={{ scale:0.88 }}
                    onClick={() => setSelectedColor(shade.color)}
                    title={`${shade.name} · ${shade.code}`}
                    className="relative aspect-square rounded-lg transition-all"
                    style={{
                      backgroundColor: shade.color,
                      border: selectedColor === shade.color ? `2.5px solid ${accent}` : '1.5px solid rgba(255,255,255,0.12)',
                      boxShadow: selectedColor === shade.color ? `0 0 10px ${accent}99` : 'none',
                    }}>
                    {shade.popular && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full border border-yellow-600" />
                    )}
                  </motion.button>
                ))}
                {filteredPalette.length === 0 && (
                  <p className="col-span-8 text-center text-white/25 text-xs py-4">No colours found</p>
                )}
              </div>

              {/* Selected colour chip */}
              <AnimatePresence>
                {selectedShade && (
                  <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="mt-3 flex items-center gap-2.5 p-2.5 rounded-xl border"
                    style={{ background:'rgba(255,255,255,0.04)', borderColor: border }}>
                    <div className="w-9 h-9 rounded-lg flex-shrink-0 border-2 border-white/15"
                      style={{ backgroundColor: finalColor || selectedColor }} />
                    <div>
                      <p className="text-xs font-bold text-white">{selectedShade.name}</p>
                      <p className="text-[10px] text-white/40">{selectedShade.code} · {selectedShade.family}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Paint Finish */}
            <div className="rounded-2xl p-4 border" style={{ background: panelBg, borderColor: border }}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">Paint Finish</h3>
              <div className="grid grid-cols-2 gap-2">
                {FINISHES.map(f => (
                  <button key={f.id} onClick={() => setSelectedFinish(f.id)}
                    className="p-2.5 rounded-xl border-2 text-left transition-all"
                    style={{
                      background: selectedFinish === f.id ? 'rgba(236,91,19,0.15)' : 'rgba(255,255,255,0.03)',
                      borderColor: selectedFinish === f.id ? accent : border,
                    }}>
                    <p className="text-[11px] font-black text-white">{f.label}</p>
                    <p className="text-[9px] text-white/35 mt-0.5 leading-tight">{f.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Adjustments */}
            <div className="rounded-2xl p-4 border" style={{ background: panelBg, borderColor: border }}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">Adjustments</h3>
              <div className="space-y-4">
                {[
                  { label:'Brightness', value: brightness, set: setBrightness, min:0.5, max:1.5, step:0.05, fmt: v=>`${Math.round(v*100)}%` },
                  { label:'Saturation', value: saturation, set: setSaturation, min:0,   max:2,   step:0.1,  fmt: v=>`${Math.round(v*100)}%` },
                ].map(({ label, value, set, min, max, step, fmt }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-white/50">{label}</label>
                      <span className="text-[11px] font-black text-white/70">{fmt(value)}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={value}
                      onChange={e => set(parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        accentColor: accent,
                        background:`linear-gradient(to right,${accent} ${((value-min)/(max-min))*100}%,rgba(255,255,255,0.12) 0%)`
                      }} />
                  </div>
                ))}
                <button onClick={() => { setBrightness(1); setSaturation(1) }}
                  className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white/40 hover:text-white/70 border transition-colors"
                  style={{ borderColor: border }}>Reset</button>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════
              CENTRE + RIGHT — Preview + Cart
          ════════════════════════════════════════════════════ */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="flex-1 flex flex-col gap-4">

            {/* ── Room Preview Canvas ── */}
            <div className="rounded-2xl overflow-hidden border shadow-2xl relative"
              style={{ background:'#0A0E18', borderColor: border, aspectRatio:'16/9.5' }}>

              {/* "Wall changes colour" hint badge */}
              {!selectedColor && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full text-xs font-semibold text-white/60 border"
                  style={{ background:'rgba(0,0,0,0.5)', borderColor: border, backdropFilter:'blur(8px)' }}>
                  🎨 Pick a colour — only the walls will change
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div key={selectedRoom + (finalColor||'x') + selectedFinish}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full">
                  <RoomScene
                    roomId={selectedRoom}
                    wallColor={finalColor}
                    finish={currentFinish}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Finish badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/60 border"
                style={{ background:'rgba(0,0,0,0.55)', borderColor: border, backdropFilter:'blur(6px)' }}>
                {currentFinish?.label} Finish
              </div>
            </div>

            {/* ── Info strip ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:'Room',   value: ROOMS.find(r=>r.id===selectedRoom)?.name || '-', icon:'🏠' },
                { label:'Colour', value: selectedShade?.name || 'None selected',           icon:'🎨',
                  extra: selectedColor && <span className="inline-block w-3 h-3 rounded-sm ml-1.5 border border-white/20 align-middle" style={{backgroundColor:finalColor||selectedColor}} /> },
                { label:'Finish', value: currentFinish?.label || '-',                       icon:'✨' },
              ].map(({ label, value, icon, extra }) => (
                <div key={label} className="rounded-xl p-3 border" style={{ background: panelBg, borderColor: border }}>
                  <span className="text-base block mb-0.5">{icon}</span>
                  <p className="text-[9px] text-white/35 uppercase tracking-widest">{label}</p>
                  <p className="text-xs font-bold text-white/80 truncate flex items-center">{value}{extra}</p>
                </div>
              ))}
            </div>

            {/* ── Add to Cart ── */}
            <div className="rounded-2xl p-5 border"
              style={{ background:'linear-gradient(135deg,rgba(236,91,19,0.12),rgba(230,126,34,0.08))', borderColor:'rgba(236,91,19,0.25)' }}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-black text-white text-base">Your Selection</h3>
                  {selectedShade ? (
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-sm text-white/65">
                        <span className="text-white font-semibold">{selectedShade.name}</span>
                        {' '}— {currentFinish?.label} Finish
                      </p>
                      <p className="text-xs text-white/40">{selectedShade.code} · {ROOMS.find(r=>r.id===selectedRoom)?.name}</p>
                      <p className="text-2xl font-black text-white mt-2">
                        ₹2,100 <span className="text-sm font-normal text-white/35">/ 12L</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-white/30 mt-1">← Select a colour from the palette</p>
                  )}
                </div>
                {selectedShade && (
                  <div className="w-16 h-16 rounded-2xl border-2 border-white/15 flex-shrink-0 shadow-lg"
                    style={{ backgroundColor: finalColor || selectedColor }} />
                )}
              </div>

              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                onClick={handleAddToCart} disabled={!selectedShade}
                className="w-full mt-4 py-3.5 rounded-xl font-black text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white"
                style={{
                  background: selectedShade
                    ? `linear-gradient(135deg,${accent},#E67E22)`
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: selectedShade ? `0 8px 28px ${accent}44` : 'none',
                }}>
                {showSuccess ? '✓ Added to Cart!' : '🛒 Add to Cart — ₹2,100'}
              </motion.button>
            </div>

            <p className="text-center text-[11px] text-white/20">
              💡 Only the <span className="text-white/40 font-semibold">wall surfaces</span> change colour — furniture, floor and ceiling remain unchanged. Actual paint shades may vary slightly on screen.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
