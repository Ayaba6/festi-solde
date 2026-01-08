'use client'

import Link from 'next/link'
import { 
  ShoppingBag, 
  Facebook, 
  Instagram, 
  Twitter, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones 
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECTION RÉASSURANCE (Les engagements) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-indigo-400">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">Livraison Rapide</h4>
              <p className="text-xs text-slate-400 mt-1 font-medium">Partout au Burkina Faso</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-indigo-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">Paiement Sécurisé</h4>
              <p className="text-xs text-slate-400 mt-1 font-medium">Orange Money & Moov Money</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-indigo-400">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">Retours Faciles</h4>
              <p className="text-xs text-slate-400 mt-1 font-medium">Sous 48 heures maximum</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-indigo-400">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">Support Client</h4>
              <p className="text-xs text-slate-400 mt-1 font-medium">Disponible 7j/7</p>
            </div>
          </div>
        </div>

        {/* SECTION NAVIGATION */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 py-16">
          
          {/* Logo & Bio */}
          <div className="col-span-1 lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShoppingBag className="text-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                Festi<span className="text-indigo-500 not-italic font-light">Solde</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Le premier festival digital dédié aux soldes de luxe et de marques. Découvrez des pépites à prix cassés chaque jour.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 bg-slate-900 rounded-full hover:bg-indigo-600 transition-colors"><Instagram size={18} /></Link>
              <Link href="#" className="p-2 bg-slate-900 rounded-full hover:bg-indigo-600 transition-colors"><Facebook size={18} /></Link>
              <Link href="#" className="p-2 bg-slate-900 rounded-full hover:bg-indigo-600 transition-colors"><Twitter size={18} /></Link>
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Boutique</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><Link href="/shop" className="hover:text-white transition-colors">Nouveautés</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Homme</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Femme</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Accessoires</Link></li>
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Aide & Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">Suivi de commande</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guide des tailles</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Devenir vendeur</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4 font-medium">Inscrivez-vous pour ne manquer aucune offre exclusive.</p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none placeholder:text-slate-600"
              />
              <button className="bg-white text-slate-950 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
                S'abonner
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-medium">
            © {currentYear} Festi Solde. Tous droits réservés. Design by <span className="text-white">Gemini Pro</span>.
          </p>
          <div className="flex items-center gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            {/* Vous pouvez mettre ici des petits logos de paiement ou du texte */}
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Paiement 100% sécurisé</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500 font-medium">
            <Link href="#" className="hover:text-white">Mentions Légales</Link>
            <Link href="#" className="hover:text-white">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}