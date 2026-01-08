'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient' // Assure-toi d'avoir configuré Supabase

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import PromoBanner from '@/app/components/PromoBanner'

// --- SIDEBAR CATÉGORIES DYNAMIQUE ---
function SidebarCategories() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  return (
    <nav className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-[calc(4rem+4rem)]">
      <h3 className="font-bold text-lg mb-4 text-slate-900 px-2">Catégories</h3>
      <ul className="space-y-1">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link 
              href={`/categorie/${cat.slug}`} 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <span className="font-medium text-sm">{cat.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// --- CARROUSEL DYNAMIQUE ---
function ImageCarousel() {
  const [slides, setSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), [slides.length])
  
  useEffect(() => {
    // Ici on peut récupérer certains produits phares ou promos pour le carrousel
    async function fetchSlides() {
      const { data } = await supabase
        .from('products')
        .select('id, nom, images, prix_solde')
        .order('created_at', { ascending: false })
        .limit(3)
      setSlides(data || [])
    }
    fetchSlides()
  }, [])

  useEffect(() => {
    if (!slides.length) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [next, slides.length])

  if (!slides.length) return null

  return (
    <div className="relative w-full h-64 md:h-[450px] rounded-3xl overflow-hidden shadow-xl group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <img src={slide.images[0]} alt={slide.nom} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
            <span className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2">
              Promo {slide.prix_solde} €
            </span>
            <h2 className="text-white text-3xl md:text-5xl font-black max-w-lg leading-tight">
              {slide.nom}
            </h2>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)} 
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`} 
          />
        ))}
      </div>
    </div>
  )
}

// --- DERNIERS ARTICLES DYNAMIQUES ---
function LatestArticles() {
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    async function fetchArticles() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)
      setArticles(data || [])
    }
    fetchArticles()
  }, [])

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(p)

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
          <Sparkles className="text-amber-400" size={24} /> Nouveautés
        </h3>
        <Link href="/articles" className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Voir tout <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((item) => (
          <div key={item.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-56 overflow-hidden bg-slate-100">
              <img src={item.images[0]} alt={item.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button title="Aperçu rapide" className="p-2.5 bg-white rounded-full hover:bg-indigo-600 hover:text-white transition-colors shadow-sm">
                  <Eye size={18}/>
                </button>
                <button title="Ajouter au panier" className="p-2.5 bg-white rounded-full hover:bg-indigo-600 hover:text-white transition-colors shadow-sm">
                  <ShoppingBag size={18}/>
                </button>
              </div>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 block">
                {item.categorie}
              </span>
              <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                {item.nom}
              </h4>
              <p className="text-indigo-600 font-black mt-2 text-lg">
                {formatPrice(item.prix_solde)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// --- LANDING PAGE PRINCIPALE ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-indigo-100 flex flex-col">
      <div className="fixed top-0 w-full z-50">
        <PromoBanner />
        <Header />
      </div>
      <main className="flex-grow pt-[calc(4rem+3rem)]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <SidebarCategories />
            </aside>
            <div className="flex-1 space-y-16">
              <ImageCarousel />
              <LatestArticles />
              {/* Section avantages */}
              <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold tracking-tight">Pourquoi choisir FestiSolde ?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <ShieldCheck size={28} />
                    </div>
                    <h3 className="font-bold text-lg">Vendeurs Certifiés</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Authenticité garantie par nos audits rigoureux.</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Zap size={28} />
                    </div>
                    <h3 className="font-bold text-lg">Offres Flash</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Réductions exclusives et stocks limités en temps réel.</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-bold text-lg">Expérience Premium</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Paiement sécurisé et service client haut de gamme.</p>
                  </div>
                </div>
              </section>
              {/* CTA */}
              <section className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Prêt à faire de bonnes affaires ?</h2>
                  <p className="text-slate-400 text-lg max-w-xl mx-auto">Rejoignez la plus grande communauté de déstockage de luxe certifiée.</p>
                  <Link href="/auth/register" className="inline-block px-12 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl">
                    Ouvrir ma boutique
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
