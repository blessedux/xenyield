"use client"

import { motion, useSpring, useTransform, useEffect } from "framer-motion"

interface AnimatedNumberProps {
  value: number
}

export default function AnimatedNumber({ value }: AnimatedNumberProps) {
  const spring = useSpring(0)
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return <motion.span>{display}</motion.span>
}

