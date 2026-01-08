'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Search, SlidersHorizontal, Tag, Grid3X3, List, ChevronRight, Filter } from 'lucide-react'
import ProductCard from '@/app/components/ProductCard'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

type Product = {
  id: string; nom: string; description: string; prix_initial: number;
  prix_solde: number; quantite_stock: number; categorie?: string;
  images?: string[]; created_at: string;
}

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProducts(data)
      const uniqueCats = Array.from(new Set(data.map((p) => p.categorie))).filter(Boolean) as string[]
      setCategories(uniqueCats)
    }
    setLoading(false)
  }

  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.categorie === selectedCategory
      const matchesSearch = p.nom.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.prix_solde - b.prix_solde
      if (sortBy === 'price-desc') return b.prix_solde - a.prix_solde
      return 0
    })

  return (
    <div className="min-h-screen bg-[#FCFCFD] flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1600px] mx-auto px-4 md:px-8 pt-32 pb-20">
        
        {/* BREADCRUMBS & TITLE SECTION */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            <span className="hover:text-indigo-600 cursor-pointer">Accueil</span>
            <ChevronRight size={12} />
            <span className="text-slate-900">Boutique</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
                Le <span className="text-indigo-600">Catalogue</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">Découvrez nos pièces sélectionnées avec soin.</p>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {filteredProducts.length} articles trouvés
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR FILTRES */}
          <aside className="hidden lg:block w-72 space-y-10">
            <div className="sticky top-40">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-indigo-600" /> Catégories
              </h3>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Tous les articles
                  <ChevronRight size={14} className={selectedCategory === 'all' ? 'text-white' : 'text-slate-300'} />
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold capitalize transition-all ${
                      selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                    <ChevronRight size={14} className={selectedCategory === cat ? 'text-white' : 'text-slate-300'} />
                  </button>
                ))}
              </div>

              {/* AIDE BOX */}
              <div className="mt-12 bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
                <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                   <Tag className="text-white" size={20} />
                </div>
                <h4 className="text-indigo-900 font-black text-sm uppercase tracking-tight">Livraison Offerte</h4>
                <p className="text-indigo-700/70 text-sm font-medium mt-2 leading-relaxed">
                  Profitez de la livraison gratuite dès 50.000 FCFA d'achat durant tout le festival.
                </p>
              </div>
            </div>
          </aside>

          {/* LISTE PRODUITS */}
          <div className="flex-1">
            
            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder="Rechercher un style, une marque..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 font-medium text-slate-700 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Mobile Filter Trigger */}
                <button className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 py-4 px-6 rounded-2xl font-bold text-sm">
                  <Filter size={18} /> Filtres
                </button>

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:w-48 bg-white border border-slate-200 text-sm font-bold py-4 px-6 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="newest">Nouveautés</option>
                  <option value="price-asc">Prix : croissant</option>
                  <option value="price-desc">Prix : décroissant</option>
                </select>
              </div>
            </div>

            {/* GRID PRODUITS */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[4/5] bg-slate-100 animate-pulse rounded-[2rem]" />
                    <div className="h-4 w-2/3 bg-slate-100 animate-pulse rounded-full" />
                    <div className="h-4 w-1/3 bg-slate-100 animate-pulse rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 py-32 text-center shadow-sm">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Aucun résultat</h3>
                <p className="text-slate-500 font-medium mt-2">Essayez d'ajuster vos filtres ou votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}