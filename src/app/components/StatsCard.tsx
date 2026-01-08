'use client'
import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color?: 'indigo' | 'blue' | 'emerald'
}

export default function StatsCard({ title, value, icon, color = 'indigo' }: StatsCardProps) {
  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
            {title}
          </p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}