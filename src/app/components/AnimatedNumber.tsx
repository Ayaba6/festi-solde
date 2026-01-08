import AnimatedDigit from './AnimatedDigit'

type AnimatedNumberProps = {
  value: number
  digits?: number
}

export default function AnimatedNumber({
  value,
  digits = 2,
}: AnimatedNumberProps) {
  const padded = value.toString().padStart(digits, '0')

  return (
    <div className="flex">
      {padded.split('').map((char, index) => (
        <AnimatedDigit key={index} value={Number(char)} />
      ))}
    </div>
  )
}
