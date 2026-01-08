'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CategoryPage() {
  const params = useParams()
  const { slug } = params
  const [products, setProducts] = useState<any[]>([])
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      // Récupérer category_id selon slug
      const { data: catData } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', slug)
        .single()

      if (!catData) return

      setCategoryName(catData.name)

      // Récupérer tous les produits de cette catégorie
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', catData.id)

      setProducts(prodData || [])
    }

    fetchProducts()
  }, [slug])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all overflow-hidden">
            <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-slate-900">{p.name}</h3>
              <p className="text-indigo-600 font-semibold">{p.price} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
