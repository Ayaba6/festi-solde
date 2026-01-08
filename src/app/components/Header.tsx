'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import PromoBanner from './PromoBanner'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 w-full z-50">
      
      {/* BANNIÈRE PROMO DYNAMIQUE */}
      <PromoBanner
        discount={70}
        endDate="2026-01-25T23:59:59"
      />

      {/* NAVBAR */}
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-3'
            : 'bg-transparent py-5 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              Festi<span className="text-indigo-600 font-light">Solde</span>
            </span>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <Link href="/boutique" className="hover:text-indigo-600 transition-colors">Boutique</Link>
            <Link href="/exclusivites" className="hover:text-indigo-600 transition-colors">Exclusivités</Link>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">Le Festival</Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="flex items-center gap-2 text-sm font-bold hover:opacity-70 transition-opacity">
              <User size={20} />
              <span className="hidden sm:inline font-bold uppercase tracking-widest text-xs">
                Espace Vendeur
              </span>
            </Link>

            <Link
              href="/boutique"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 inline-block"
            >
              Explorer
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
