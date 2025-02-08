"use client"

import { motion } from "framer-motion"

const SocialLinks = () => {
  const links = [
    {
      name: 'Telegram',
      icon: '/icons/telegram.svg',
      href: 'https://t.me/blessedux',
    },
    {
      name: 'GitHub',
      icon: '/icons/github.svg',
      href: 'https://github.com/blessedux',
    },
    {
      name: 'Mantle',
      icon: '/icons/mantle.svg',
      href: 'https://mantle.xyz',
    },
  ]

  return (
    <motion.div 
      className="fixed bottom-6 right-6 flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-black/80 backdrop-blur-sm border border-amber-500/20 
                   hover:border-amber-500/40 transition-colors duration-200"
        >
          <img 
            src={link.icon} 
            alt={link.name} 
            className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" 
          />
        </a>
      ))}
    </motion.div>
  )
}

export default SocialLinks 