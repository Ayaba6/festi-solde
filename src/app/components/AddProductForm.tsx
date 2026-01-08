'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Upload, X, Loader2, CheckCircle2, AlertCircle, ImagePlus } from 'lucide-react'

type AddProductFormProps = {
  onSuccess?: () => void
}

export default function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [prixInitial, setPrixInitial] = useState('')
  const [prixSolde, setPrixSolde] = useState('')
  const [quantite, setQuantite] = useState('')

  const [categorie, setCategorie] = useState('')
  const [sousCategorie, setSousCategorie] = useState('')

  const [categoriesList, setCategoriesList] = useState<{id:number, name:string}[]>([])
  const [subcategoriesList, setSubcategoriesList] = useState<{id:number, name:string, category_id:number}[]>([])

  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- FETCH CATEGORIES ET SOUS-CATEGORIES ---
  useEffect(() => {
    async function fetchCategories() {
      const { data: cats } = await supabase.from('categories').select('*').order('name')
      const { data: subs } = await supabase.from('subcategories').select('*').order('name')
      setCategoriesList(cats || [])
      setSubcategoriesList(subs || [])
    }
    fetchCategories()
  }, [])

  // --- GESTION DES IMAGES ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  // --- SUBMIT FORMULAIRE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (images.length === 0) throw new Error('Ajoutez au moins une image pour votre produit.')
      if (!categorie || !sousCategorie) throw new Error('Veuillez sélectionner catégorie et sous-catégorie.')

      const { data: session } = await supabase.auth.getSession()
      const userId = session.session?.user.id
      if (!userId) throw new Error('Session expirée, veuillez vous reconnecter.')

      const imageUrls: string[] = []
      for (const img of images) {
        const fileExt = img.name.split('.').pop()
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
        const path = `${userId}/${fileName}`

        const { error: uploadError } = await supabase.storage.from('products').upload(path, img)
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('products').getPublicUrl(path)
        imageUrls.push(data.publicUrl)
      }

      const { error } = await supabase.from('products').insert({
        nom,
        description,
        prix_initial: Number(prixInitial),
        prix_solde: prixSolde ? Number(prixSolde) : Number(prixInitial),
        quantite_stock: Number(quantite),
        category_id: Number(categorie),
        subcategory_id: Number(sousCategorie),
        id_vendeur: userId,
        images: imageUrls,
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Produit ajouté avec succès !' })
      setTimeout(() => onSuccess?.(), 1500)

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">

      {/* NOM & DESCRIPTION */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Nom de l'article</label>
          <input placeholder="Ex: iPhone 15 Pro Max" value={nom} onChange={e => setNom(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Description</label>
          <textarea placeholder="Détaillez les caractéristiques principales..." value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} min-h-[120px] resize-none`} required />
        </div>
      </div>

      {/* PRIX & STOCK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Prix (FCFA)</label>
          <input type="number" placeholder="0.00" value={prixInitial} onChange={e => setPrixInitial(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Prix Promo</label>
          <input type="number" placeholder="Facultatif" value={prixSolde} onChange={e => setPrixSolde(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Stock</label>
          <input type="number" placeholder="Qté" value={quantite} onChange={e => setQuantite(e.target.value)} className={inputClass} required />
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Catégorie</label>
          <select className={inputClass} value={categorie} onChange={e => setCategorie(e.target.value)} required>
            <option value="">Sélectionnez une catégorie</option>
            {categoriesList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Sous-catégorie</label>
          <select className={inputClass} value={sousCategorie} onChange={e => setSousCategorie(e.target.value)} required disabled={!categorie}>
            <option value="">Sélectionnez une sous-catégorie</option>
            {subcategoriesList.filter(sub => sub.category_id.toString() === categorie).map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
          </select>
        </div>
      </div>

      {/* IMAGES */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-700 ml-1">Photos du produit</label>
        <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all">
          <div className="bg-white shadow-sm w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <ImagePlus className="text-indigo-600" size={24} />
          </div>
          <p className="text-sm font-bold text-slate-700">Cliquez pour ajouter des images</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG jusqu'à 5 Mo</p>
          <input ref={fileInputRef} type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square group animate-in fade-in zoom-in duration-300">
                <img src={src} className="w-full h-full object-cover rounded-xl border border-slate-100" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-white text-red-500 shadow-md rounded-full p-1.5 hover:bg-red-50 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MESSAGE */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      {/* SUBMIT */}
      <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
        {loading ? <>
          <Loader2 className="animate-spin" size={20} />
          <span>Mise en ligne en cours...</span>
        </> : <span>Confirmer l'ajout</span>}
      </button>

    </form>
  )
}
