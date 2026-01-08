'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Lock, Mail, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Redirection si déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) router.push('/dashboard')
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Empêche le rechargement de la page
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(`Erreur : ${error.message}`)
      setLoading(false)
    } else {
      setMessage('Connexion réussie 🎉 Redirection...')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      {/* Côté gauche : Design & Logo */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="z-10 text-center">
          <Link href="/" className="flex items-center gap-3 mb-8 justify-center">
            <div className="bg-indigo-600 p-3 rounded-2xl">
              <ShoppingBag className="text-white" size={32} />
            </div>
            <span className="text-4xl font-black text-white uppercase tracking-tighter">
              Festi<span className="text-indigo-400 font-light">Solde</span>
            </span>
          </Link>
          <p className="text-slate-400 text-lg font-medium max-w-sm mx-auto">
            Accédez à votre espace vendeur et gérez vos offres exclusives en temps réel.
          </p>
        </div>
      </div>

      {/* Côté droit : Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Bouton retour site */}
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-12 transition-colors">
            <ArrowLeft size={16} /> Retour au site
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Bon retour !</h1>
            <p className="text-slate-500 font-medium">Connectez-vous pour gérer votre boutique.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendeur@exemple.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-bold ${message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {message}
              </div>
            )}
          </form>

          <p className="text-center mt-10 text-slate-500 font-medium">
            Pas encore vendeur ?{' '}
            <Link href="/auth/register" className="text-indigo-600 font-black hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}