'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Import des images depuis /public/images
import slide1 from '@/public/images/slide1.jpg'
import slide2 from '@/public/images/slide2.jpg'
import slide3 from '@/public/images/slide3.jpg'

const SLIDES = [
  { url: slide1, title: 'Collection Hiver', subtitle: "Jusqu'à -50%" },
  { url: slide2, title: 'Nouvelle Arrivée', subtitle: 'Accessoires de luxe' },
  { url: slide3, title: 'Édition Limitée', subtitle: 'Exclusivité web' },
]

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [offset, setOffset] = useState(0) // pour parallax texte

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [nextSlide, isPaused])

  // Effet parallax au scroll du carousel (optionnel)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setOffset(scrollTop * 0.2) // ajuster la vitesse
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={slide.url}
            alt={slide.title}
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            priority={index === 0}
          />

          {/* Overlay avec texte parallax */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-16"
            style={{ transform: `translateY(${offset * 0.1}px)` }} // effet parallax léger
          >
            <p className="text-white/80 uppercase tracking-[0.2em] text-sm mb-2 translate-y-4 animate-fade-in">
              {slide.subtitle}
            </p>
            <h2 className="text-white text-4xl md:text-6xl font-black mb-6 translate-y-2">
              {slide.title}
            </h2>
          </div>
        </div>
      ))}

      {/* Boutons navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-slate-900"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-slate-900"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicateurs (dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
