import { useState, useEffect } from 'react'

export function useCountdown(initialTime: string) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    // Convert "MM:SS" to total seconds
    const [minutes, seconds] = initialTime.split(':').map(Number)
    let totalSeconds = minutes * 60 + seconds

    const timer = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1
        const newMinutes = Math.floor(totalSeconds / 60)
        const newSeconds = totalSeconds % 60
        setTimeLeft(`${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`)
      } else {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [initialTime])

  return timeLeft
} 