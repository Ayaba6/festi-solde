'use client'

import { useEffect, useState } from 'react'

/* =========================
   COMPOSANTS ANIMATION
========================= */

function AnimatedDigit({ value }: { value: number }) {
  return (
    <div className="relative h-5 w-3 overflow-hidden">
      <div
        className="absolute top-0 left-0 transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${value * 100}%)` }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-5 w-3 flex items-center justify-center"
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimatedNumber({
  value,
  digits = 2,
}: {
  value: number
  digits?: number
}) {
  const padded = value.toString().padStart(digits, '0')

  return (
    <div className="flex">
      {padded.split('').map((char, index) => (
        <AnimatedDigit key={index} value={Number(char)} />
      ))}
    </div>
  )
}

/* =========================
   PROMO BANNER
========================= */

type PromoBannerProps = {
  discount?: number
  endDate: string // ex: "2026-01-25T23:59:59"
}

export default function PromoBanner({
  discount = 70,
  endDate,
}: PromoBannerProps) {
  const [expired, setExpired] = useState(false)
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now()
      const end = new Date(endDate).getTime()
      const diff = end - now

      if (diff <= 0) {
        setExpired(true)
        return
      }

      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  if (expired) return null

  return (
    <div className="bg-indigo-600 text-white py-2 px-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] flex flex-wrap items-center justify-center gap-2">
      
      <span>🔥 Jusqu’à</span>

      {/* POURCENTAGE ROUGE CLIGNOTANT */}
      <span className="text-red-600 animate-pulse font-extrabold drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]">
        -{discount}%
      </span>

      <span>— Fin dans</span>

      {/* COMPTE À REBOURS ANIMÉ */}
      <div className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-md font-mono tracking-normal">
        <AnimatedNumber value={time.days} digits={2} />
        <span>j</span>

        <AnimatedNumber value={time.hours} digits={2} />
        <span>h</span>

        <AnimatedNumber value={time.minutes} digits={2} />
        <span>m</span>

        <AnimatedNumber value={time.seconds} digits={2} />
        <span>s</span>
      </div>
    </div>
  )
}
