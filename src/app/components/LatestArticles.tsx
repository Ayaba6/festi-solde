import { ShoppingBag, Eye } from 'lucide-react'

type Article = {
  id: number
  title: string
  category: string
  image: string
  price: number
}

const ARTICLES: Article[] = [
  { id: 1, title: 'Sac à main Louis Vuitton', category: 'Sacs', image: '/images/sac1.jpg', price: 1200 },
  { id: 2, title: 'Chaussures Gucci', category: 'Chaussures', image: '/images/shoes1.jpg', price: 850 },
  { id: 3, title: 'Montre Rolex', category: 'Montres', image: '/images/watch1.jpg', price: 5000 },
]

export default function LatestArticles() {
  // Formateur de prix (€)
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  return (
    <section className="py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Nouveautés</h3>
          <p className="text-slate-500 text-sm">
            Découvrez nos dernières pépites sélectionnées pour vous.
          </p>
        </div>
        <button className="text-indigo-600 font-medium text-sm hover:underline">
          Voir tout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTICLES.map((item: Article) => (
          <article
            key={item.id}
            className="group bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-2 bg-white rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                  <Eye size={20} />
                </button>
                <button className="p-2 bg-white rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                  <ShoppingBag size={20} />
                </button>
              </div>
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-700">
                {item.category}
              </span>
            </div>

            {/* Infos */}
            <div className="p-5">
              <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h4>
              <div className="flex justify-between items-center mt-3">
                <p className="text-xl font-black text-slate-900">
                  {formatPrice(item.price)}
                </p>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                  Acheter
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
