"use client"

export default function SplineBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <iframe 
        src='https://my.spline.design/purpleplanetwithmoon-5d7e1cabc13dfe14cafb614e325dbe20/'
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="XenoYield Background"
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
    </div>
  )
} 