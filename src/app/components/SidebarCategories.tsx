'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SidebarCategories() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const data = await fetchCategoriesWithSub()
      setCategories(data)
    }
    fetchData()
  }, [])

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 border border-slate-100 sticky top-[calc(4rem+3rem)]">
      <h3 className="font-bold text-lg mb-4">Catégories</h3>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="group">
            <Link
              href={`/categorie/${cat.slug}`}
              className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <span>{cat.icon}</span>
              <span className="font-medium">{cat.name}</span>
            </Link>

            {/* Sous-catégories */}
            {cat.subcategories.length > 0 && (
              <ul className="ml-6 mt-1 space-y-1 hidden group-hover:block">
                {cat.subcategories.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`/categorie/${cat.slug}/${sub.slug}`}
                      className="text-slate-500 hover:text-indigo-500 text-sm transition-colors"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
