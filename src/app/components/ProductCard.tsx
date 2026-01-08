'use client'

import React from 'react'
import { ShoppingCart, Eye } from 'lucide-react' // Optionnel : installe lucide-react pour les icônes

type ProductCardProps = {
  nom: string
  description: string
  prix_initial: number
  prix_solde: number
  quantite_stock: number
  images?: string[]
}

export default function ProductCard({
  nom,
  description,
  prix_initial,
  prix_solde,
  quantite_stock,
  images,
}: ProductCardProps) {
  
  // Calcul du pourcentage de réduction
  const remise = Math.round(((prix_initial - prix_solde) / prix_initial) * 100);
  const estEnSolde = prix_solde < prix_initial;
  const estEnRupture = quantite_stock <= 0;

  // Formatage du prix (ex: 15 000)
  const formatPrix = (prix: number) => 
    new Intl.NumberFormat('fr-FR').format(prix);

  return (
    <div className="group relative flex flex-col w-full max-w-sm overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      
      {/* Conteneur Image avec Badge */}
      <div className="relative mx-3 mt-3 overflow-hidden rounded-xl h-64">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={nom}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
            Pas d'image disponible
          </div>
        )}

        {/* Badge de réduction */}
        {estEnSolde && !estEnRupture && (
          <span className="absolute top-2 left-2 rounded-full bg-red-600 px-3 py-1 text-center text-xs font-bold text-white shadow-lg">
            -{remise}%
          </span>
        )}

        {/* Overlay au survol (Boutons d'action rapide) */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-md hover:bg-blue-600 hover:text-white transition-colors">
             <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Détails du produit */}
      <div className="flex flex-col p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 flex-1 leading-tight">
            {nom}
          </h3>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-4">
          {description}
        </p>

        {/* Section Prix */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-black text-blue-600">
            {formatPrix(prix_solde)} <span className="text-sm font-bold">FCFA</span>
          </span>
          {estEnSolde && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrix(prix_initial)}
            </span>
          )}
        </div>

        {/* Pied de carte : Stock et Action */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${
              estEnRupture ? 'text-red-500' : 'text-emerald-500'
            }`}>
              {estEnRupture ? 'Épuisé' : 'Disponible'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Stock: {quantite_stock} unités
            </span>
          </div>

          <button 
            disabled={estEnRupture}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              estEnRupture 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-95 shadow-md'
            }`}
          >
            <ShoppingCart size={16} />
            Acheter
          </button>
        </div>
      </div>
    </div>
  )
}