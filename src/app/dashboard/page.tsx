'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  TrendingUp, 
  Layers, 
  Plus, 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag,
  Trash2
} from 'lucide-react'

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import ProductCard from '@/app/components/ProductCard'
import AddProductForm from '@/app/components/AddProductForm'
import Modal from '@/app/components/Modal'
import StatsCard from '@/app/components/StatsCard'
import PromoBanner from '@/app/components/PromoBanner'

type Category = { id: number; name: string; id_vendeur: string }
type SubCategory = { id: number; name: string; category_id: number }

type Product = {
  id: string
  nom: string
  description: string
  prix_initial: number
  prix_solde: number
  quantite_stock: number
  images?: string[]
  id_vendeur: string
  created_at: string
  category_id?: number
  subcategory_id?: number
  category_name?: string
  subcategory_name?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        router.push('/auth/login')
      } else {
        const uId = session.user.id
        setUserId(uId)
        await fetchCategories(uId)
        await fetchSubCategories()
        fetchProducts(uId)
      }
    }
    checkUser()
  }, [router])

  const fetchCategories = async (uId: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id_vendeur', uId)

    if (!error && data) setCategories(data)
  }

  const fetchSubCategories = async () => {
    const { data, error } = await supabase.from('subcategories').select('*')
    if (!error && data) setSubCategories(data)
  }

  const fetchProducts = async (uId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id_vendeur', uId)
        .order('created_at', { ascending: false })

      if (data) {
        const mapped = data.map((p: Product) => {
          const cat = categories.find(c => c.id === p.category_id)
          const sub = subCategories.find(s => s.id === p.subcategory_id)
          return {
            ...p,
            category_name: cat?.name,
            subcategory_name: sub?.name
          }
        })
        setProducts(mapped)
      }
      if (error) console.error(error)
    } catch (err) {
      console.error("Erreur fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      console.error("Erreur suppression produit:", err)
      alert("Impossible de supprimer le produit.")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const totalProduits = products.length
  const stockTotal = products.reduce((sum, p) => sum + (p.quantite_stock || 0), 0)
  const produitsEnSolde = products.filter(p => p.prix_solde < p.prix_initial).length

  if (!userId && loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      
      {/* HEADER FIXE */}
      <div className="fixed top-0 w-full z-50">
        <PromoBanner />
        <Header />
      </div>

      {/* ESPACE POUR HEADER FIXE */}
      <div className="flex flex-1 pt-[calc(4rem+3rem)]">
        
        {/* SIDEBAR */}
        <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200">
          <div className="p-8 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">MarketPro</span>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl font-semibold cursor-pointer transition-all">
              <LayoutDashboard size={20} />
              Tableau de bord
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-500 mb-2 px-2">Mes Catégories</h3>
              <ul className="space-y-1">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <div className="px-3 py-2 rounded-xl hover:bg-indigo-50 cursor-pointer font-medium text-slate-700">
                      {cat.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium">
              <LogOut size={20} />
              Se déconnecter
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          
          {/* HEADER DU DASHBOARD */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Vue d'ensemble</h1>
              <p className="text-slate-500 font-medium">Gérez votre inventaire et suivez vos performances.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95">
              <Plus size={20} /> <span>Ajouter un produit</span>
            </button>
          </header>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <StatsCard title="Total Produits" value={totalProduits} icon={<Package size={24} />} color="indigo" />
            <StatsCard title="Stock Global" value={stockTotal} icon={<Layers size={24} />} color="blue" />
            <StatsCard title="En Promotion" value={produitsEnSolde} icon={<TrendingUp size={24} />} color="emerald" />
          </div>

          {/* PRODUITS */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-slate-900">Mes Articles</h2>
              <span className="text-sm font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{products.length} articles</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(n => <div key={n} className="h-72 bg-white rounded-3xl border border-slate-100 animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="text-slate-300" size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Aucun produit trouvé</h3>
                <p className="text-slate-500 mb-8">Commencez à vendre en ajoutant votre premier article.</p>
                <button onClick={() => setIsModalOpen(true)} className="text-indigo-600 font-bold hover:text-indigo-700 transition-all">+ Créer mon premier produit</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(p => (
                  <div key={p.id} className="relative group">
                    <ProductCard {...p} category_name={p.category_name} subcategory_name={p.subcategory_name} />
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                      title="Supprimer le produit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* MODAL */}
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvel Article">
            <div className="p-1">
              <AddProductForm 
                categories={categories} 
                subCategories={subCategories} 
                onSuccess={() => {
                  setIsModalOpen(false)
                  if(userId) fetchProducts(userId)
                }}
              />
            </div>
          </Modal>

        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
