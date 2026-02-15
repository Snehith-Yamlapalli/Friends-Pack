'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { STORIES } from "@/lib/stories";

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const storyId = params.id as string;
  
  const story = STORIES.find(s => s.id === storyId);
  const [currentImage, setCurrentImage] = useState(0);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            404
          </h1>
          <p className="text-xl">Story not found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-8 px-6 py-3 bg-white text-black border-4 border-black font-bold hover:bg-gray-200"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % story.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + story.images.length) % story.images.length);
  };

  return (
    <div className="min-h-screen text-black p-4 sm:p-6 md:p-8 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>

      <main className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between flex-wrap gap-4">
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
            {story.title}
          </h1>
          
          <div className="w-24 sm:w-32 md:w-40"></div> {/* Spacer for alignment */}
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
          {/* Image Gallery - 2 columns */}
          <div className="lg:col-span-2 border-2 sm:border-4 border-black bg-white p-3 sm:p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            {/* Main Image */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] border-2 sm:border-4 border-black mb-4">
              <Image
                src={story.images[currentImage]}
                alt={`${story.title} - Image ${currentImage + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-5xl md:text-7xl font-black transition-all z-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center opacity-50 hover:opacity-100"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-5xl md:text-7xl font-black transition-all z-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center opacity-50 hover:opacity-100"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
                aria-label="Next image"
              >
                ›
              </button>

              {/* Image counter */}
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black bg-opacity-80 border-2 border-white px-2 py-1 sm:px-4 sm:py-2 text-white font-mono text-xs sm:text-sm z-10" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                [{currentImage + 1}/{story.images.length}]
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-2">
              {story.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative aspect-square border-2 border-black overflow-hidden transition-all ${
                    currentImage === idx 
                      ? 'ring-4 ring-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Story Text - 1 column */}
          <div className="border-2 sm:border-4 border-black bg-white p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <h3 className="text-xs sm:text-sm font-black mb-4 pb-3 border-b-2 border-black" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              [STORY]
            </h3>
            
            {/* Date and Time */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-black text-white px-3 py-1.5 text-[10px] sm:text-xs font-mono">
                 {story.date}
              </div>
              <div className="bg-black text-white px-3 py-1.5 text-[10px] sm:text-xs font-mono">
                 {story.time}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <p className="text-sm sm:text-base leading-relaxed font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {story.fullStory}
              </p>
              
              <div className="mt-6 pt-4 border-t-2 border-black border-dashed">
                <h4 className="text-[10px] sm:text-xs font-black mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  STATS:
                </h4>
                <ul className="space-y-1 text-xs sm:text-sm font-mono">
                  <li>• IMAGES: {story.images.length}</li>
                  <li>• WORDS: {story.fullStory.split(' ').length}</li>
                  <li>• TYPE: {story.id.toUpperCase()}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
