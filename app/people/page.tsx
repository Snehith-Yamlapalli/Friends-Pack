'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PEOPLE } from "@/lib/people";
import { useState } from "react";

export default function PeoplePage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen text-black p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#ffffff' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>

      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs sm:text-sm font-black border-2 sm:border-4 border-black px-3 py-2 sm:px-4 sm:py-3 bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            ← BACK
          </button>
          
          <h1 
            className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-black border-4 sm:border-6 md:border-8 border-black px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              lineHeight: '1.6'
            }}
          >
            MEET THE PACK
          </h1>
          
          <div className="w-24 sm:w-32 md:w-40"></div>
        </header>

        {/* People Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PEOPLE.map((person) => (
            <div
              key={person.id}
              className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredCard(person.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transform: hoveredCard === person.id ? 'translate(-4px, -4px)' : 'translate(0, 0)'
              }}
            >
              {/* Image Container */}
              <div className="relative w-full h-64 border-b-4 border-black overflow-hidden">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
                {/* Overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: person.color }}
                />
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 
                    className="text-lg font-black mb-2 group-hover:translate-x-2 transition-transform duration-300"
                    style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: '1.6' }}
                  >
                    {person.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black"></div>
                    <p 
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      {person.role}
                    </p>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-4">
                  <p className="text-sm leading-relaxed font-medium">
                    {person.bio}
                  </p>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-black opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-black opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
