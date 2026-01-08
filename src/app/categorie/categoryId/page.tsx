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
  const params = useParams()
  const categoryId = Number(params.categoryId) // ✅ conversion explicite

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    if (!categoryId) return

    const fetchCategoryProducts = async () => {
      setLoading(true)
      try {
        // 🔹 Produits de la catégorie
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false })

        if (!productsError && productsData) {
          setProducts(productsData)
        }

        // 🔹 Nom de la catégorie
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('name')
          .eq('id', categoryId)
          .single()

        if (!categoryError && categoryData) {
          setCategoryName(categoryData.name)
        }
      } catch (err) {
        console.error('Erreur chargement catégorie:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [categoryId])

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          {categoryName || 'Catégorie'}
        </h1>

        {loading ? (
          <div className="text-slate-500">Chargement...</div>
        ) : products.length === 0 ? (
          <div className="text-slate-500">
            Aucun produit trouvé dans cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
