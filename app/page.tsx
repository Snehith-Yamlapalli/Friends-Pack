'use client';

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { COLOR_PALETTE, getHoverColor } from "@/lib/palette";
import { STORIES } from "@/lib/stories";

export default function Home() {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [bgColor, setBgColor] = useState<string>(COLOR_PALETTE[0]); // Start with first color for SSR
  const router = useRouter();

  // Set random background color after mount (client-side only)
  useEffect(() => {
    setBgColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
  }, []);



  const photos = STORIES.map(story => ({
    id: story.id,
    url: story.thumbnail,
    summary: story.summary,
    title: story.title,
    date: story.date,
    time: story.time
  }));

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="min-h-screen text-black p-4 sm:p-6 md:p-8 overflow-x-hidden overflow-y-auto relative" style={{ backgroundColor: '#ffffff' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        @keyframes arrowBounce {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }
        
        .arrow-hover:hover .arrow-icon {
          animation: arrowBounce 0.6s ease-in-out infinite;
        }
      `}</style>
      
      
      <main className="max-w-7xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-4 sm:mb-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Spacer for alignment on desktop */}
            <div className="hidden sm:block sm:w-32 md:w-40"></div>
            
            {/* Title - centered */}
            <div className="flex-shrink-0">
              <h1 
                className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-black border-4 sm:border-6 md:border-8 border-black inline-block px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  transform: 'perspective(500px) rotateX(-2deg)',
                  lineHeight: '1.6'
                }}
              >
                VIKINGS 2022-2026
              </h1>
            </div>
            
            {/* Meet People Button - right aligned on desktop, centered on mobile */}
            <button
              onClick={() => router.push('/people')}
              className="arrow-hover group flex-shrink-0"
              aria-label="Meet the team"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white border-2 border-black px-2 py-1.5 sm:px-3 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]">
                <span className="text-[8px] sm:text-[10px] font-black whitespace-nowrap" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  MEET PEOPLE
                </span>
                <span className="text-sm sm:text-base arrow-icon transition-transform">→</span>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1 min-h-0 lg:overflow-hidden">
          {/* Photo Gallery - Takes 2 columns */}
          <div className="lg:col-span-2 border-2 sm:border-4 border-black bg-white p-3 sm:p-4 md:p-6 relative overflow-hidden flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] min-h-[340px] sm:min-h-[460px] lg:h-full lg:max-h-full">
            {/* HUD Corner Brackets */}
           
            
            <div className="flex-1 relative flex items-center justify-center overflow-hidden border-2 sm:border-4 border-black cursor-pointer group"
              onClick={() => router.push(`/story/${photos[currentPhoto].id}`)}
            >
              <Image
                src={photos[currentPhoto].url}
                alt={`Photo ${currentPhoto + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              
              {/* Click to view overlay */}
              <div className="absolute inset-0  opacity-50 bg-opacity-0 hover:opacity-100 group-hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center z-10">
                <div className="opacity-0  group-hover:opacity-75 hover:opacity-100 transition-opacity duration-300 text-white text-xs sm:text-sm md:text-base font-black border-4 border-white px-6 py-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" style={{ fontFamily: "'Press Start 2P', monospace", letterSpacing: '0.1em' }}>
                  CLICK TO VIEW
                </div>
              </div>
              
              {/* Navigation Arrows - 8-bit style */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-5xl md:text-7xl font-black transition-all z-10   w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center opacity-50 hover:opacity-100"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-5xl md:text-7xl font-black transition-all z-10    w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center opacity-50 hover:opacity-100"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
                aria-label="Next photo"
              >
                ›
              </button>

              {/* Photo counter HUD */}
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4  bg-opacity-80 border-2 border-white px-2 py-1 sm:px-4 sm:py-2 text-white font-mono text-xs sm:text-sm z-10" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                [{currentPhoto + 1}/{photos.length}]
              </div>
            </div>
            
            <div className="mt-3 sm:mt-4 flex-shrink-0">
              <h2 className="text-sm sm:text-xl md:text-2xl font-black text-center mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                /// EVENT
              </h2>
              <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono">
                <div className="bg-black text-white px-2 py-1 border-2 border-black">
                   {photos[currentPhoto].date}
                </div>
                <div className="bg-black text-white px-2 py-1 border-2 border-black">
                   {photos[currentPhoto].time}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-6 overflow-visible lg:overflow-hidden h-auto lg:h-full max-h-none lg:max-h-full">
            {/* Spotify Player */}
            <div className="border-2 sm:border-4 border-black bg-white p-3 sm:p-4 flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="w-full">
                <iframe
                  src="https://open.spotify.com/embed/playlist/2SS3mIt20CJRGsJjxvWHnh?utm_source=generator&theme=0"  
                  height="352"
                  width={"100%"}
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                 
                  style={{ borderRadius: 0 }}
                  className="min-h-[250px] sm:min-h-[300px]"
                ></iframe>
              </div>
            </div>

            {/* Summary */}
            <div className="border-2 sm:border-4 border-black bg-white p-3 sm:p-4 flex-1 min-h-[200px] lg:min-h-0 overflow-visible lg:overflow-hidden flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 left-2 text-[#CCFF00] text-xs font-mono">|||</div>
              <h3 className="text-[10px] sm:text-xs font-black mb-2 sm:mb-3 pb-2 border-b-2 border-black flex-shrink-0" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                [SUMMARY]
              </h3>
              <div className="flex-1 overflow-y-auto pr-2">
                <p className="text-xs sm:text-sm font-bold leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {photos[currentPhoto].summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
