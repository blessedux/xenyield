"use client"

export default function GameBackground() {
  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <iframe 
        src='https://my.spline.design/spacestation-0de501a186333b3bf1aa222062378088/'
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'all' // Enable mouse interaction
        }}
        title="XenoYield Game Background"
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />
    </div>
  )
} 