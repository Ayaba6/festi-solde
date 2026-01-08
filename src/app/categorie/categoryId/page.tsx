'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import ProductCard from '@/app/components/ProductCard'

type Product = {
  id: string
  nom: string
  description: string
  prix_initial: number
  prix_solde: number
  quantite_stock: number
  images?: string[]
  category_id?: number
  subcategory_id?: number
}

export default function CategoryPage() {
  const { categoryId } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false })

        if (!error && data) setProducts(data)

        // Récupération du nom de la catégorie
        const { data: catData } = await supabase
          .from('categories')
          .select('name')
          .eq('id', categoryId)
          .single()
        if (catData) setCategoryName(catData.name)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [categoryId])

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <h1 className="text-3xl font-bold text-slate-900 p-6">{categoryName}</h1>

      {loading ? (
        <div className="p-6">Chargement...</div>
      ) : products.length === 0 ? (
        <div className="p-6 text-slate-500">Aucun produit trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {products.map(p => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  )
}
