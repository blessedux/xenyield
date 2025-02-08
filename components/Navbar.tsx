"use client"

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-amber-500 font-mono text-xl">
              XY
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="https://pewter-sight-502.notion.site/XEN-YIELD-Whitepaper-1933124defbd80af896ad39e41369e75?pvs=73/"
                className="text-gray-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 target="_blank"
              >
                Docs
              </Link>
              <a
                href="https://explorer.testnet.mantle.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Block Explorer
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 