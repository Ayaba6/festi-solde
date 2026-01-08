'use client'

type AnimatedDigitProps = {
  value: number
}

export default function AnimatedDigit({ value }: AnimatedDigitProps) {
  return (
    <div className="relative h-5 w-3 overflow-hidden">
      <div
        className="absolute top-0 left-0 transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateY(-${value * 100}%)`,
        }}
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
