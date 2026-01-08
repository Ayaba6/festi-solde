'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Lock, Mail, ArrowLeft, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/login`,
      }
    })

    if (error) {
      setMessage(`Erreur : ${error.message}`)
      setLoading(false)
    } else {
      setMessage('Inscription réussie 🎉. Vérifie ta boîte mail pour valider ton compte.')
      setEmail('')
      setPassword('')
      setLoading(false)
      // Redirection après un court délai
      setTimeout(() => router.push('/auth/login'), 4000)
    }
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      {/* CÔTÉ GAUCHE : VISUEL */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 items-center justify-center relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[100px]" />
        
        <div className="z-10 text-center px-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white mb-8">
            <Sparkles size={16} />
            <span className="text-[10px] uppercase font-black tracking-widest">Rejoignez l'élite</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            Vendez vos pièces <br /> au meilleur prix.
          </h2>
          <p className="text-indigo-100 text-lg font-medium max-w-sm mx-auto">
            Devenez partenaire du plus grand festival de déstockage de luxe en ligne.
          </p>
        </div>
      </div>

      {/* CÔTÉ DROIT : FORMULAIRE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Retour */}
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-12 transition-colors">
            <ArrowLeft size={16} /> Retour au site
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Créer un compte</h1>
            <p className="text-slate-500 font-medium">Commencez l'aventure FestiSolde dès aujourd'hui.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email professionnel</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@boutique.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création en cours...' : 'Créer mon espace vendeur'}
            </button>

            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-bold animate-in fade-in slide-in-from-top-2 ${message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {message}
              </div>
            )}
          </form>

          <p className="text-center mt-10 text-slate-500 font-medium">
            Déjà inscrit ?{' '}
            <Link href="/auth/login" className="text-indigo-600 font-black hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}