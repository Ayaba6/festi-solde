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

export default function SubCategoryPage() {
  const { categoryId, subcategoryId } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [subcategoryName, setSubcategoryName] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .eq('subcategory_id', subcategoryId)
          .order('created_at', { ascending: false })

        if (!error && data) setProducts(data)

        // Nom sous-catégorie
        const { data: subData } = await supabase
          .from('subcategories')
          .select('name')
          .eq('id', subcategoryId)
          .single()
        if (subData) setSubcategoryName(subData.name)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId, subcategoryId])

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <h1 className="text-3xl font-bold text-slate-900 p-6">{subcategoryName}</h1>

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
